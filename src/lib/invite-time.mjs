export function validTimeZone(zone) {
  if (typeof zone !== "string" || (zone !== "UTC" && !zone.includes("/"))) return false;
  try { new Intl.DateTimeFormat("en", { timeZone: zone }).format(); return true; } catch { return false; }
}
function wallParts(ms, zone) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(ms));
  return Object.fromEntries(parts.map(p => [p.type, p.value]));
}
function wallString(ms, zone) {
  const p = wallParts(ms, zone);
  return p.year + "-" + p.month + "-" + p.day + "T" + p.hour + ":" + p.minute;
}
// Invert the explicitly confirmed IANA zone. Reject DST gaps and require a choice for overlaps.
export function resolveMeetingTime(wall, zone, occurrence = "") {
  if (!validTimeZone(zone)) throw new Error("Choose a valid IANA meeting-place time zone, for example Asia/Shanghai.");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(wall)) throw new Error("Enter a complete meeting date and time.");
  const utc = Date.parse(wall + ":00Z");
  if (!Number.isFinite(utc) || new Date(utc).toISOString().slice(0,16) !== wall) throw new Error("Enter a valid calendar date and time.");
  const offsets = new Set();
  for (let h = -36; h <= 36; h += 6) {
    const sample = utc + h * 3600000;
    const p = wallParts(sample, zone);
    offsets.add(Date.parse(p.year+"-"+p.month+"-"+p.day+"T"+p.hour+":"+p.minute+":00Z") - sample);
  }
  const candidates = [...offsets].map(offset => utc - offset).filter(ms => wallString(ms, zone) === wall).sort((a,b) => a-b);
  if (!candidates.length) throw new Error("This local time does not exist because the clocks move forward. Choose another time.");
  if (candidates.length > 1 && !["earlier", "later"].includes(occurrence)) throw new Error("This time occurs twice when clocks move back. Choose its first or second occurrence.");
  return new Date(occurrence === "later" ? candidates.at(-1) : candidates[0]).toISOString();
}
export function formatInviteTime(invite, locale = "en-GB") {
  if (!invite.startsAt || !validTimeZone(invite.timeZone) || !Number.isFinite(Date.parse(invite.startsAt))) {
    return (invite.scheduledTime || "Unscheduled").replace("T", " ") + " · time zone unconfirmed (legacy)";
  }
  return new Intl.DateTimeFormat(locale, { timeZone: invite.timeZone, dateStyle: "medium", timeStyle: "short" }).format(new Date(invite.startsAt)) + " · " + invite.timeZone;
}
