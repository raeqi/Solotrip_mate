import {test} from "node:test";
import assert from "node:assert/strict";
import {resolveMeetingTime,formatInviteTime} from "../src/lib/invite-time.mjs";
import {applyInvite,reviewInvite,cancelInvite} from "../src/lib/invite-actions.mjs";
test("Shanghai 19:00 is 11:00 UTC; formatter uses meeting zone rather than viewer zone",()=>{
 const startsAt=resolveMeetingTime("2027-01-05T19:00","Asia/Shanghai");
 assert.equal(startsAt,"2027-01-05T11:00:00.000Z");
 assert.match(formatInviteTime({startsAt,timeZone:"Asia/Shanghai"}),/19:00.*Asia\/Shanghai/);
});
test("legacy wall time is never assigned a guessed zone",()=>{
 assert.match(formatInviteTime({scheduledTime:"2026-11-18T18:30"}),/18:30.*unconfirmed/);
});
test("DST gaps, overlaps, invalid dates and invalid zones fail explicitly",()=>{
 assert.throws(()=>resolveMeetingTime("2027-03-14T02:30","America/New_York"),/does not exist/);
 assert.throws(()=>resolveMeetingTime("2027-11-07T01:30","America/New_York"),/occurs twice/);
 assert.equal(resolveMeetingTime("2027-11-07T01:30","America/New_York","earlier"),"2027-11-07T05:30:00.000Z");
 assert.equal(resolveMeetingTime("2027-11-07T01:30","America/New_York","later"),"2027-11-07T06:30:00.000Z");
 assert.throws(()=>resolveMeetingTime("2027-02-30T10:00","Asia/Shanghai"),/calendar/);
 assert.throws(()=>resolveMeetingTime("2027-01-01T10:00","PST"),/IANA/);
});
test("local simulation enforces owner review, capacity, idempotency and cancellation",()=>{
 const base={id:"i",creatorId:"host",startsAt:"2027-01-05T11:00:00Z",timeZone:"Asia/Shanghai",capacity:1,status:"open",applications:[]};
 let i=applyInvite(base,"a","A","2026-11-22T00:00:00Z");
 i=applyInvite(i,"b","B","2026-11-22T00:00:00Z");
 assert.equal(applyInvite(i,"a","A","2026-11-22T00:00:00Z").applications.length,2);
 assert.throws(()=>reviewInvite(i,"a",i.applications[0].id,"accepted"),/Only the host/);
 i=reviewInvite(i,"host",i.applications[0].id,"accepted");
 assert.throws(()=>reviewInvite(i,"host",i.applications[1].id,"accepted"),/filled/);
 i=cancelInvite(i,"host");
 assert.throws(()=>applyInvite(i,"c","C","2026-11-22T00:00:00Z"),/cancelled/);
});
import {migrateBrowserData} from "../src/lib/browser-migration.mjs";
test("v5 custom private draft and legacy invitations survive migration without inferred zones",()=>{
 const draft={id:"my-private-draft",status:"draft",description:"PRIVATE",itinerary:[{items:[{activity:"Private stop"}]}]};
 const legacy={id:"old-invite",creator:"Host",scheduledTime:"2026-11-18T19:00"};
 const defaults={profile:{nickname:"Host"},trips:[],invites:[],localActorId:""};
 const migrated=migrateBrowserData({trips:[draft],invites:[legacy]},defaults,"browser-one");
 assert.deepEqual(migrated.trips,[draft]);
 assert.equal(migrated.invites[0].scheduledTime,legacy.scheduledTime);
 assert.equal(migrated.invites[0].timeZone,undefined);
 assert.equal(migrated.invites[0].startsAt,undefined);
 assert.equal(migrated.invites[0].creatorId,"browser-one");
 assert.equal(migrateBrowserData(migrated,defaults,"browser-two").localActorId,"browser-one");
});
