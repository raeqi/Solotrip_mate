# Phase 1 acceptance — Solotrip Mate

Base: e2efde95c1e2f8ecda220270e6fcb0bde32fc84f (remote default google).
Branch: feat/phase1-activity-invites.
Separate checkout; old QA copies were clean and left unchanged. No AGENTS.md or
.agents/skills instructions were present. No push, merge, external account or
deployment was performed.

## Implemented P0

- 390px Plan/Invite/My invites navigation; editable existing private drafts.
- Selected-activity public snapshot; detail after saving and hosted/applicant lists.
- Explicit browser-only simulation, separate opt-in loopback SQLite exchange.
- Host-confirmed participation, private applicant views, atomic companion capacity,
  cancellation and no mother-itinerary endpoint.
- Confirmed IANA zone + UTC instant; no guessed legacy zones; DST disambiguation.
- Unlocated activities stay in lists; no fabricated coordinates.

## Automated checks executed

- 12 node:test checks passed: Shanghai 19:00 = 11:00 UTC, viewer-independent
  formatting, DST gap/overlap, invalid dates/zones, v5 custom draft preservation,
  legacy times unchanged, browser simulation transitions, real HTTP cookie sessions,
  privacy whitelist, refresh/restart, authorization, CSRF, cancelled access,
  input bounds and two independent SQLite Worker connections racing for one place.
- ESLint and TypeScript passed.
- Final Next.js production build passed after integration fixes.
- Real production Next server on 127.0.0.1:3126 passed
  tests/local-invites-next.mjs with three separate cookie sessions. Checks included
  applicant self-approval (403), two confirmations for capacity one
  (one success, one 409), no private marker in returned snapshots, absent private
  trip API (404), refresh, cancellation and foreign-origin rejection.
- Public SQLite snapshot inspection for QA Shanghai dinner activity:
  startsAt 2027-01-05T11:00:00.000Z; timeZone Asia/Shanghai; no coordinates,
  private description, itinerary or source trip/activity IDs.

## Browser checks executed in cloud computer

Maps were viewed behind a temporary local CSP proxy blocking OSM images before
loading. Blank basemaps are expected setup, not evidence of a map defect.
Desktop and 390x844 iframe layout were used, not native phone emulation.

1. Mobile navigation -> existing Quiet Kyoto Autumn Escape draft -> Edit private
   plan -> save a synthetic private description. Existing itinerary was retained.
2. Its second activity -> Invite for this activity. Only that activity prefilled;
   private description absent, public note blank.
3. Change meeting place to a synthetic Shanghai point. Inherited coordinates
   cleared; explicitly confirm Asia/Shanghai and 2027-01-05 19:00. Saving navigated
   directly to detail showing 19:00 Asia/Shanghai and Not located/list only.
4. A separate localhost cookie/storage session saw the public activity in its
   local shared list. It applied; the host's 127.0.0.1 session confirmed; applicant
   showed accepted and retained it after refresh. The private trip description
   did not appear. These were two real local backend identities, not the role switch.
5. Host cancelled. Applicant's already-open detail changed to Invite unavailable.
   After the final production build and service restart, host cancellation and
   browser-only accepted participation were retained. The real Next integration
   check passed again against the final build.
6. With shared mode disabled on a separate server, banner explicitly said
   browser-only/nothing sent. Existing legacy invite displayed raw wall time with
   unconfirmed zone. Its replacement form did not guess a zone.
7. Created QA browser-only activity, switched explicit Demo guest role, applied,
   returned to host and confirmed, then switched guest to see accepted. This was
   only a local role simulation.

## Boundaries / P1

No public deployment, hosted Supabase adapter, production authentication, account
recovery, notifications or public share link was added. The supplied Supabase
schema's broad public SELECT examples remain unused. Automatic place lookup and
geographic time-zone resolution are not implemented: the user confirms the
meeting-place IANA zone. Shared-mode private journeys never leave localStorage.

The local cookie is a test identity, not verified account ownership. This adapter
must remain loopback-only. Real map tiles, true device behavior and external
services were not validated. No real user data or messages were used.
