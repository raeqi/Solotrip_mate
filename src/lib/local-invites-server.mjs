/** Local, opt-in invitation exchange. Never connect this adapter to public hosting. */
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';

const COOKIE = 'solotrip_local_invite_session';
const MAX_BODY = 16384;
const SESSION_SECONDS = 30 * 86400;
const stores = new Map();

export class InviteError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

function fail(message, status = 400) { throw new InviteError(message, status); }
function object(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('Expected a JSON object.');
  return value;
}
function text(value, label, max, optional = false) {
  if (optional && (value === undefined || value === '')) return '';
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) fail(`${label} is required and must be at most ${max} characters.`);
  return value.trim();
}
function identifier(value, label = 'Invitation ID') {
  const result = text(value, label, 100);
  if (!/^[A-Za-z0-9_-]+$/.test(result)) fail(`${label} is invalid.`);
  return result;
}
function validActor(actor) {
  if (typeof actor !== 'string' || !/^[a-f0-9-]{36}$/.test(actor)) fail('Start a local session first.', 401);
  return actor;
}
function invitationFields(input, clock) {
  const d = object(input);
  if (!['meal', 'activity'].includes(d.type)) fail('Choose a meal or activity.');
  const zone = text(d.timeZone, 'Meeting-place IANA time zone', 100);
  if (zone !== 'UTC' && !zone.includes('/')) fail('Confirm an IANA area/location time zone, such as Asia/Shanghai.');
  let timeZone;
  try { timeZone = new Intl.DateTimeFormat('en', { timeZone: zone }).resolvedOptions().timeZone; }
  catch { fail('The meeting-place IANA time zone is invalid.'); }
  const raw = text(d.startsAt, 'UTC meeting time', 32);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(raw)) fail('Meeting time must be an explicit UTC ISO timestamp.');
  const milliseconds = Date.parse(raw);
  if (!Number.isFinite(milliseconds)) fail('Meeting time is invalid.');
  const startsAt = new Date(milliseconds).toISOString();
  if (startsAt.slice(0, 19) !== raw.slice(0, 19)) fail('Meeting time is invalid.');
  if (milliseconds <= clock()) fail('Choose a future meeting time.');
  if (!Number.isInteger(d.capacity) || d.capacity < 1 || d.capacity > 12) fail('Companion places must be between 1 and 12.');
  let coordinates;
  if (d.coordinates !== undefined) {
    if (!Array.isArray(d.coordinates) || d.coordinates.length !== 2 ||
      d.coordinates.some(x => typeof x !== 'number' || !Number.isFinite(x)) ||
      Math.abs(d.coordinates[0]) > 90 || Math.abs(d.coordinates[1]) > 180) fail('Coordinates are invalid.');
    coordinates = [d.coordinates[0], d.coordinates[1]];
  }
  // Only the selected activity's public snapshot crosses this boundary. Ignore all
  // unknown fields, including private descriptions, itinerary, sourceTripId and IDs.
  return {
    type: d.type, title: text(d.title, 'Title', 160), location: text(d.location, 'Meeting place', 300),
    scheduledTime: startsAt, startsAt, timeZone, note: text(d.note, 'Public note', 1000, true),
    creator: text(d.creator, 'Host display name', 80), capacity: d.capacity,
    ...(coordinates ? { coordinates } : {}),
  };
}

export async function createInviteStore(filename, options = {}) {
  if (filename !== ':memory:' && !isAbsolute(filename)) fail('Local invitation database needs an absolute path.', 500);
  // Dynamically loaded: browser-only mode does not require node:sqlite.
  const { DatabaseSync } = await import('node:sqlite');
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS local_invite_sessions (
      token_hash TEXT PRIMARY KEY, actor_id TEXT NOT NULL, expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS local_invites (
      id TEXT PRIMARY KEY, creator_id TEXT NOT NULL, public_snapshot TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('open','cancelled')), created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS local_invite_applications (
      id TEXT PRIMARY KEY, invite_id TEXT NOT NULL REFERENCES local_invites(id) ON DELETE CASCADE,
      applicant_id TEXT NOT NULL, applicant_name TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending','accepted','declined')), created_at TEXT NOT NULL,
      UNIQUE(invite_id,applicant_id)
    );
    CREATE INDEX IF NOT EXISTS local_applications_invite ON local_invite_applications(invite_id);`);
  const clock = options.clock || Date.now;
  const hash = token => createHash('sha256').update(token).digest('hex');
  function transaction(fn) {
    db.exec('BEGIN IMMEDIATE');
    try { const result = fn(); db.exec('COMMIT'); return result; }
    catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  function row(id) {
    const r = db.prepare('SELECT * FROM local_invites WHERE id=?').get(identifier(id));
    if (!r) fail('Invitation not found.', 404);
    return r;
  }
  function present(r, actor) {
    const owner = r.creator_id === actor;
    if (r.status === 'cancelled' && !owner) fail('Invitation not found.', 404);
    const applications = db.prepare(`SELECT id, applicant_id, applicant_name, status, created_at
      FROM local_invite_applications WHERE invite_id=? AND (?=1 OR applicant_id=?) ORDER BY created_at,id`).all(r.id, owner ? 1 : 0, actor)
      .map(a => ({ id: a.id, applicantId: a.applicant_id, applicantName: a.applicant_name, status: a.status, createdAt: a.created_at }));
    const acceptedCount = Number(db.prepare("SELECT count(*) AS n FROM local_invite_applications WHERE invite_id=? AND status='accepted'").get(r.id).n);
    return { ...JSON.parse(r.public_snapshot), id: r.id, creatorId: r.creator_id, status: r.status, applications, acceptedCount };
  }
  function active(r) {
    if (r.status !== 'open') fail('This invitation has been cancelled.', 410);
    if (Date.parse(JSON.parse(r.public_snapshot).startsAt) <= clock()) fail('This invitation has already started.', 410);
  }
  return {
    close() { db.close(); },
    session(token, create = false) {
      if (typeof token === 'string' && /^[a-f0-9]{64}$/.test(token)) {
        const found = db.prepare('SELECT actor_id FROM local_invite_sessions WHERE token_hash=? AND expires_at>?').get(hash(token), clock());
        if (found) return { actorId: found.actor_id, token, created: false };
      }
      if (!create) fail('Start or refresh your local session first.', 401);
      const fresh = randomBytes(32).toString('hex');
      const actorId = randomUUID();
      db.prepare('INSERT INTO local_invite_sessions VALUES(?,?,?)').run(hash(fresh), actorId, clock() + SESSION_SECONDS * 1000);
      return { actorId, token: fresh, created: true };
    },
    list(actor) {
      validActor(actor);
      return db.prepare("SELECT * FROM local_invites WHERE status='open' OR creator_id=? ORDER BY created_at DESC,id").all(actor).map(r => present(r, actor));
    },
    create(actor, input) {
      validActor(actor);
      const snapshot = invitationFields(input, clock);
      const id = input.id === undefined ? randomUUID() : identifier(input.id);
      return transaction(() => {
        const existing = db.prepare('SELECT * FROM local_invites WHERE id=?').get(id);
        if (existing) {
          if (existing.creator_id !== actor || existing.public_snapshot !== JSON.stringify(snapshot)) fail('This invitation ID is already in use.', 409);
          return present(existing, actor);
        }
        db.prepare("INSERT INTO local_invites VALUES(?,?,?,'open',?)").run(id, actor, JSON.stringify(snapshot), new Date(clock()).toISOString());
        return present(row(id), actor);
      });
    },
    apply(actor, inviteId, displayName) {
      validActor(actor);
      const applicantName = text(displayName, 'Participant display name', 80);
      return transaction(() => {
        const r = row(inviteId);
        if (r.creator_id === actor) fail('You cannot apply to your own invitation.', 409);
        active(r);
        const existing = db.prepare('SELECT id FROM local_invite_applications WHERE invite_id=? AND applicant_id=?').get(r.id, actor);
        if (!existing) {
          const snapshot = JSON.parse(r.public_snapshot);
          const count = Number(db.prepare("SELECT count(*) AS n FROM local_invite_applications WHERE invite_id=? AND status='accepted'").get(r.id).n);
          if (count >= snapshot.capacity) fail('All companion places are confirmed.', 409);
          db.prepare("INSERT INTO local_invite_applications VALUES(?,?,?,?,'pending',?)").run(randomUUID(), r.id, actor, applicantName, new Date(clock()).toISOString());
        }
        return present(r, actor);
      });
    },
    review(actor, inviteId, applicationId, status) {
      validActor(actor);
      if (!['accepted', 'declined'].includes(status)) fail('Choose accepted or declined.');
      return transaction(() => {
        const r = row(inviteId);
        if (r.creator_id !== actor) fail('Only the invitation host can review applications.', 403);
        active(r);
        const application = db.prepare('SELECT * FROM local_invite_applications WHERE id=? AND invite_id=?').get(identifier(applicationId, 'Application ID'), r.id);
        if (!application) fail('Application not found.', 404);
        if (application.status === status) return present(r, actor);
        if (application.status !== 'pending') fail('This application has already been decided.', 409);
        if (status === 'accepted') {
          const count = Number(db.prepare("SELECT count(*) AS n FROM local_invite_applications WHERE invite_id=? AND status='accepted'").get(r.id).n);
          if (count >= JSON.parse(r.public_snapshot).capacity) fail('All companion places are confirmed.', 409);
        }
        db.prepare('UPDATE local_invite_applications SET status=? WHERE id=?').run(status, application.id);
        return present(r, actor);
      });
    },
    cancel(actor, inviteId) {
      validActor(actor);
      return transaction(() => {
        const r = row(inviteId);
        if (r.creator_id !== actor) fail('Only the invitation host can cancel it.', 403);
        db.prepare("UPDATE local_invites SET status='cancelled' WHERE id=?").run(r.id);
        return present(row(r.id), actor);
      });
    },
  };
}

export function validateLocalRequest(request, mutation = false) {
  const host = request.headers.get('host');
  if (!host || !/^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/.test(host)) fail('Local invitation exchange requires a loopback Host.', 403);
  const url = new URL(request.url);
  if (!/^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/.test(url.host) || !['http:', 'https:'].includes(url.protocol)) fail('Local request address mismatch.', 403);
  const origin = request.headers.get('origin');
  if ((origin && origin !== `${url.protocol}//${host}`) || (mutation && !origin) || request.headers.get('sec-fetch-site') === 'cross-site') fail('Cross-origin local invitation access is not allowed.', 403);
}
function cookieToken(header) {
  return (header || '').split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
}
function json(data, status = 200, cookie) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Vary': 'Cookie, Origin' };
  if (cookie) headers['Set-Cookie'] = `${COOKIE}=${cookie}; HttpOnly; SameSite=Strict; Path=/api/local-invites; Max-Age=${SESSION_SECONDS}`;
  return new Response(JSON.stringify(data), { status, headers });
}
async function readBody(request) {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') fail('Send application/json.', 415);
  const length = request.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BODY)) fail('Request body is too large.', 413);
  if (!request.body) fail('A JSON object is required.');
  const reader = request.body.getReader();
  let bytes = 0; const chunks = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BODY) { await reader.cancel(); fail('Request body is too large.', 413); }
    chunks.push(value);
  }
  let body;
  try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { fail('A valid JSON object is required.'); }
  return object(body);
}

/** Dependency injection keeps the exact HTTP boundary covered by isolated tests. */
export async function handleLocalInviteRequest(request, options = {}) {
  try {
    const mutation = request.method !== 'GET';
    validateLocalRequest(request, mutation);
    const enabled = options.enabled ?? process.env.SOLO_LOCAL_INVITES === '1';
    if (!enabled) return mutation ? json({ error: 'Local shared invitations are disabled.' }, 403) : json({ enabled: false });
    if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);
    let store = options.store;
    if (!store) {
      const filename = process.env.SOLO_INVITES_DB || resolve(process.cwd(), '.local-data/invites.sqlite');
      if (!isAbsolute(filename)) fail('Local invitation database needs an absolute path.', 500);
      if (!stores.has(filename)) stores.set(filename, createInviteStore(filename).catch(error => { stores.delete(filename); throw error; }));
      store = await stores.get(filename);
    }
    const session = store.session(cookieToken(request.headers.get('cookie')), !mutation);
    const cookie = session.created ? session.token : undefined;
    if (!mutation) return json({ enabled: true, actorId: session.actorId, invites: store.list(session.actorId) }, 200, cookie);
    const d = await readBody(request);
    let invite;
    if (d.action === 'create') invite = store.create(session.actorId, object(d.invite));
    else if (d.action === 'apply') invite = store.apply(session.actorId, d.inviteId, d.displayName);
    else if (d.action === 'review') invite = store.review(session.actorId, d.inviteId, d.applicationId, d.status);
    else if (d.action === 'cancel') invite = store.cancel(session.actorId, d.inviteId);
    else fail('Unknown invitation action.');
    return json({ invite }, 200);
  } catch (error) {
    if (error instanceof InviteError) return json({ error: error.message }, error.status);
    // Do not return environment values, SQL, file paths, or server exception text.
    return json({ error: 'The local invitation store is unavailable. Check the local server log and Node version.' }, 503);
  }
}
