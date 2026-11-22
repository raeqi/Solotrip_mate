/** Integration against an already running, opt-in Next server with a disposable DB.
 * SOLO_LOCAL_INVITES=1 SOLO_INVITES_DB=/absolute/qa.sqlite npm run dev -- --hostname 127.0.0.1
 * node tests/local-invites-next.mjs http://127.0.0.1:3000
 * Creates and then cancels its own synthetic invitation; no third-party requests.
 */
import assert from 'node:assert/strict';

const origin = new URL(process.argv[2] || 'http://127.0.0.1:3000').origin;
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname), 'This check is restricted to a loopback server.');
async function call(cookie, data, extra = {}) {
  const response = await fetch(origin + '/api/local-invites', {
    method: data ? 'POST' : 'GET',
    headers: { ...(cookie ? { Cookie: cookie } : {}), ...(data ? { Origin: origin, 'Content-Type': 'application/json' } : {}), ...extra },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
  return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] };
}
const host = await call(); const guest = await call(); const third = await call();
assert.equal(host.status, 200); assert.equal(host.data.enabled, true, 'Start Next with SOLO_LOCAL_INVITES=1 and a disposable SOLO_INVITES_DB.');
assert.notEqual(host.data.actorId, guest.data.actorId); assert.notEqual(host.cookie, guest.cookie);
const marker = 'PRIVATE_TRIP_' + crypto.randomUUID();
const future = new Date(Date.now() + 86400000).toISOString();
const created = await call(host.cookie, { action: 'create', invite: {
  type: 'activity', title: 'QA synthetic local dinner', location: 'QA Shanghai meeting point', startsAt: future,
  timeZone: 'Asia/Shanghai', creator: 'QA Host', note: 'Only the selected public activity', capacity: 1,
  sourceTripId: marker, itinerary: [{ private: marker }], description: marker,
} });
assert.equal(created.status, 200);
const id = created.data.invite.id;
const a = await call(guest.cookie, { action: 'apply', inviteId: id, displayName: 'QA Guest' });
const b = await call(third.cookie, { action: 'apply', inviteId: id, displayName: 'QA Guest Two' });
assert.equal(a.status, 200); assert.equal(b.status, 200);
assert.equal((await call(guest.cookie, { action: 'review', inviteId: id, applicationId: a.data.invite.applications[0].id, status: 'accepted' })).status, 403);
const approved = await Promise.all([a, b].map(x => call(host.cookie, { action: 'review', inviteId: id, applicationId: x.data.invite.applications[0].id, status: 'accepted' })));
assert.deepEqual(approved.map(x => x.status).sort(), [200, 409]);
const guestRefresh = await call(guest.cookie);
const item = guestRefresh.data.invites.find(x => x.id === id);
assert.equal(item.acceptedCount, 1); assert.equal(item.applications.length, 1);
assert.doesNotMatch(JSON.stringify(guestRefresh.data), new RegExp(marker));
assert.equal((await fetch(origin + '/api/trips/' + marker)).status, 404);
assert.equal((await call(guest.cookie, { action: 'cancel', inviteId: id })).status, 403);
assert.equal((await call(host.cookie, { action: 'cancel', inviteId: id })).status, 200);
assert.equal((await call(guest.cookie)).data.invites.some(x => x.id === id), false);
assert.equal((await call(host.cookie)).data.invites.find(x => x.id === id).status, 'cancelled');
assert.equal((await call(host.cookie, { action: 'cancel', inviteId: id }, { Origin: 'https://evil.example' })).status, 403);
console.log(JSON.stringify({ status: 'passed', origin, sessions: 3, checks: ['public snapshot only', 'isolated opaque cookies', 'applicant cannot self-approve', 'concurrent acceptance capacity', 'private itinerary endpoint absent', 'refresh', 'cancelled guest access removed', 'CSRF rejection'] }, null, 2));
