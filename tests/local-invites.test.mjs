import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { Worker } from 'node:worker_threads';
import { once } from 'node:events';
import { createInviteStore, handleLocalInviteRequest, InviteError } from '../src/lib/local-invites-server.mjs';

const NOW = Date.parse('2030-01-01T00:00:00Z');
const freshInvite = overrides => ({ type: 'activity', title: 'A public dinner', location: 'Shanghai meeting point',
  startsAt: '2030-02-01T11:00:00.000Z', timeZone: 'Asia/Shanghai', note: 'Selected activity only', creator: 'Host', capacity: 1, ...overrides });
async function fixture(t, clock = () => NOW) {
  const dir = mkdtempSync(join(tmpdir(), 'solo-invites-'));
  const filename = join(dir, 'exchange.sqlite');
  let store = await createInviteStore(filename, { clock });
  const server = createServer(async (req, res) => {
    if (req.url !== '/api/local-invites') { res.writeHead(404).end(); return; }
    const body = [];
    for await (const chunk of req) body.push(chunk);
    const request = new Request(`http://${req.headers.host}${req.url}`, {
      method: req.method, headers: req.headers,
      ...(req.method !== 'GET' ? { body: Buffer.concat(body) } : {}),
    });
    const response = await handleLocalInviteRequest(request, { enabled: true, store });
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => { await new Promise(resolve => server.close(resolve)); store.close(); rmSync(dir, { recursive: true, force: true }); });
  async function call(cookie, payload, options = {}) {
    const response = await fetch(origin + (options.path || '/api/local-invites'), {
      method: payload === undefined ? 'GET' : 'POST',
      headers: { ...(cookie ? { Cookie: cookie } : {}), ...(payload !== undefined ? { Origin: origin, 'Content-Type': 'application/json' } : {}), ...options.headers },
      ...(payload !== undefined ? { body: options.raw ?? JSON.stringify(payload) } : {}),
    });
    const cookieHeader = response.headers.get('set-cookie');
    const result = await response.text();
    return { status: response.status, data: result ? JSON.parse(result) : null, cookie: cookieHeader?.split(';')[0], cookieHeader };
  }
  const host = await call(); const guest = await call();
  return { call, host, guest, filename, get store() { return store; },
    async reopen() { store.close(); store = await createInviteStore(filename, { clock }); } };
}
function assertError(fn, status) { assert.throws(fn, error => error instanceof InviteError && error.status === status); }

test('disabled mode does not touch its database and rejects non-loopback or cross-origin access', async () => {
  const request = (url, headers, method = 'GET') => new Request(url, { method, headers });
  const good = 'http://127.0.0.1:3116/api/local-invites';
  const disabled = await handleLocalInviteRequest(request(good, { Host: '127.0.0.1:3116' }), { enabled: false });
  assert.deepEqual(await disabled.json(), { enabled: false });
  for (const [url, headers, method] of [
    [good, { Host: 'evil.example' }, 'GET'],
    [good, { Host: '127.0.0.1.evil.example' }, 'GET'],
    ['http://evil.example/api/local-invites', { Host: '127.0.0.1:3116' }, 'GET'],
    [good, { Host: '127.0.0.1:3116', Origin: 'https://evil.example' }, 'GET'],
    [good, { Host: '127.0.0.1:3116', 'Sec-Fetch-Site': 'cross-site' }, 'GET'],
    [good, { Host: '127.0.0.1:3116' }, 'POST'],
  ]) assert.equal((await handleLocalInviteRequest(request(url, headers, method), { enabled: false })).status, 403);
});

test('isolated cookie sessions publish only selected activity and complete host-confirmed application', async t => {
  const f = await fixture(t);
  assert.notEqual(f.host.cookie, f.guest.cookie);
  assert.notEqual(f.host.data.actorId, f.guest.data.actorId);
  assert.match(f.host.cookieHeader, /HttpOnly; SameSite=Strict/);
  assert.match(f.host.cookieHeader, /Path=\/api\/local-invites/);
  assert.equal(f.host.cookieHeader.includes(f.host.data.actorId), false);
  const sent = freshInvite({ id: 'chosen-activity', sourceTripId: 'PRIVATE_MOTHER_TRIP', sourceActivityId: 'PRIVATE_ACTIVITY_ID',
    itinerary: [{ title: 'PRIVATE_MOTHER_TRIP' }], description: 'PRIVATE_HOTEL_ADDRESS' });
  const create = await f.call(f.host.cookie, { action: 'create', invite: sent });
  assert.equal(create.status, 200);
  assert.equal(create.data.invite.startsAt, '2030-02-01T11:00:00.000Z');
  assert.equal(create.data.invite.timeZone, 'Asia/Shanghai');
  assert.equal(create.data.invite.creatorId, f.host.data.actorId);
  const id = create.data.invite.id;
  const retry = await f.call(f.host.cookie, { action: 'create', invite: sent });
  assert.equal(retry.data.invite.id, id);
  assert.equal((await f.call(f.guest.cookie, { action: 'create', invite: sent })).status, 409);
  const ownerApply = await f.call(f.host.cookie, { action: 'apply', inviteId: id, displayName: 'Host' });
  assert.equal(ownerApply.status, 409);
  const apply = await f.call(f.guest.cookie, { action: 'apply', inviteId: id, displayName: 'Guest' });
  assert.equal(apply.status, 200);
  assert.equal(apply.data.invite.applications[0].status, 'pending');
  const applicationId = apply.data.invite.applications[0].id;
  const duplicate = await f.call(f.guest.cookie, { action: 'apply', inviteId: id, displayName: 'Changed name' });
  assert.equal(duplicate.data.invite.applications.length, 1);
  assert.equal(duplicate.data.invite.applications[0].applicantName, 'Guest');
  assert.equal((await f.call(f.guest.cookie, { action: 'review', inviteId: id, applicationId, status: 'accepted' })).status, 403);
  assert.equal((await f.call(f.guest.cookie, { action: 'cancel', inviteId: id })).status, 403);
  const confirm = await f.call(f.host.cookie, { action: 'review', inviteId: id, applicationId, status: 'accepted' });
  assert.equal(confirm.status, 200);
  assert.equal(confirm.data.invite.acceptedCount, 1);
  assert.equal((await f.call(f.host.cookie, { action: 'review', inviteId: id, applicationId, status: 'accepted' })).status, 200);
  const guestRefresh = await f.call(f.guest.cookie);
  assert.equal(guestRefresh.data.invites[0].applications[0].status, 'accepted');
  assert.equal((await f.call(undefined, { action: 'apply', inviteId: id, displayName: 'No session' })).status, 401);
  // The public actor ID cannot be substituted for the opaque session cookie.
  const forged = `solotrip_local_invite_session=${f.host.data.actorId}`;
  assert.equal((await f.call(forged, { action: 'cancel', inviteId: id })).status, 401);
  assert.equal((await f.call(f.guest.cookie, undefined, { path: '/api/trips/PRIVATE_MOTHER_TRIP' })).status, 404);
  assert.doesNotMatch(JSON.stringify(guestRefresh.data), /PRIVATE_MOTHER_TRIP|PRIVATE_ACTIVITY_ID|PRIVATE_HOTEL_ADDRESS|sourceTripId|itinerary/);
  assert.doesNotMatch(readFileSync(f.filename).toString('utf8'), /PRIVATE_MOTHER_TRIP|PRIVATE_ACTIVITY_ID|PRIVATE_HOTEL_ADDRESS/);
});

test('applicant details stay private, restart preserves sessions, cancellation removes non-owner access', async t => {
  const f = await fixture(t);
  const third = await f.call();
  const create = await f.call(f.host.cookie, { action: 'create', invite: freshInvite({ capacity: 2 }) });
  const id = create.data.invite.id;
  await f.call(f.guest.cookie, { action: 'apply', inviteId: id, displayName: 'Private Guest A' });
  await f.call(third.cookie, { action: 'apply', inviteId: id, displayName: 'Private Guest B' });
  const ownerView = await f.call(f.host.cookie); const guestView = await f.call(f.guest.cookie);
  assert.equal(ownerView.data.invites[0].applications.length, 2);
  assert.equal(guestView.data.invites[0].applications.length, 1);
  assert.doesNotMatch(JSON.stringify(guestView.data), /Private Guest B/);
  await f.reopen();
  const reopened = await f.call(f.host.cookie);
  assert.equal(reopened.data.actorId, f.host.data.actorId);
  assert.equal(reopened.cookie, undefined);
  assert.equal(reopened.data.invites[0].applications.length, 2);
  const cancelled = await f.call(f.host.cookie, { action: 'cancel', inviteId: id });
  assert.equal(cancelled.status, 200); assert.equal(cancelled.data.invite.status, 'cancelled');
  assert.equal((await f.call(f.host.cookie)).data.invites[0].status, 'cancelled');
  assert.equal((await f.call(f.guest.cookie)).data.invites.length, 0);
  assert.equal((await f.call(f.guest.cookie, { action: 'apply', inviteId: id, displayName: 'Guest' })).status, 410);
  assert.equal((await f.call(f.host.cookie, { action: 'review', inviteId: id, applicationId: reopened.data.invites[0].applications[0].id, status: 'accepted' })).status, 410);
});

test('concurrent confirmations on separate SQLite connections never overbook', async t => {
  const f = await fixture(t);
  const host = f.host.data.actorId; const first = f.guest.data.actorId; const second = f.store.session(undefined, true).actorId;
  const invite = f.store.create(host, freshInvite());
  const a = f.store.apply(first, invite.id, 'A').applications[0].id;
  const b = f.store.apply(second, invite.id, 'B').applications[0].id;
  const moduleUrl = new URL('../src/lib/local-invites-server.mjs', import.meta.url).href;
  function reviewer(applicationId) {
    const worker = new Worker(`const {parentPort,workerData}=require('node:worker_threads');
      import(workerData.moduleUrl).then(async ({createInviteStore})=>{
        const store=await createInviteStore(workerData.filename,{clock:()=>${NOW}});
        parentPort.postMessage('ready');
        parentPort.once('message',()=>{try{store.review(workerData.host,workerData.inviteId,workerData.applicationId,'accepted');parentPort.postMessage(200)}catch(e){parentPort.postMessage(e.status||500)}finally{store.close();parentPort.close()}})
      });`, { eval: true, workerData: { moduleUrl, filename: f.filename, host, inviteId: invite.id, applicationId } });
    t.after(() => worker.terminate());
    return worker;
  }
  const wa = reviewer(a), wb = reviewer(b);
  await Promise.all([once(wa, 'message'), once(wb, 'message')]);
  const results = Promise.all([once(wa, 'message'), once(wb, 'message')]);
  wa.postMessage('go'); wb.postMessage('go');
  assert.deepEqual((await results).map(x => x[0]).sort(), [200, 409]);
  const saved = f.store.list(host)[0];
  assert.equal(saved.acceptedCount, 1);
  assert.equal(saved.applications.filter(x => x.status === 'accepted').length, 1);
});

test('invalid UTC times, zones, capacity, coordinates, malformed and oversized bodies are rejected', async t => {
  const f = await fixture(t);
  for (const overrides of [
    { startsAt: '2030-02-01T19:00' }, { startsAt: '2029-02-01T11:00:00Z' },
    { startsAt: '2030-02-30T11:00:00Z' }, { timeZone: 'PST' }, { timeZone: 'Asia/NoSuchPlace' },
    { capacity: 0 }, { capacity: 13 }, { capacity: 1.5 }, { coordinates: [91, 0] },
    { coordinates: ['31', 121] }, { coordinates: [31, 181] }, { title: '' },
  ]) assert.equal((await f.call(f.host.cookie, { action: 'create', invite: freshInvite(overrides) })).status, 400, JSON.stringify(overrides));
  assert.equal((await f.call(f.host.cookie, {}, { raw: 'broken-json' })).status, 400);
  assert.equal((await f.call(f.host.cookie, {}, { raw: '[]' })).status, 400);
  assert.equal((await f.call(f.host.cookie, {}, { headers: { 'Content-Type': 'text/plain' } })).status, 415);
  assert.equal((await f.call(f.host.cookie, {}, { raw: JSON.stringify({ huge: 'x'.repeat(18000) }) })).status, 413);
  assert.equal((await f.call(f.host.cookie, {}, { headers: { Origin: 'http://evil.example' } })).status, 403);
});

test('expired invitations reject applications without rewriting a historical meeting time', async t => {
  let now = NOW;
  const f = await fixture(t, () => now);
  const made = await f.call(f.host.cookie, { action: 'create', invite: freshInvite({ startsAt: '2030-01-02T11:00:00.000Z' }) });
  now = Date.parse('2030-01-03T00:00:00Z');
  assert.equal((await f.call(f.guest.cookie, { action: 'apply', inviteId: made.data.invite.id, displayName: 'Guest' })).status, 410);
  assert.equal((await f.call(f.guest.cookie)).data.invites[0].startsAt, '2030-01-02T11:00:00.000Z');
});

test('non-absolute configured database paths and invalid actor identifiers are rejected', async t => {
  await assert.rejects(createInviteStore('relative.sqlite'), error => error.status === 500);
  const f = await fixture(t);
  assertError(() => f.store.list('Host'), 401);
});
