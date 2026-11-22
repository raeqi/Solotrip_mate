export function applyInvite(invite, actorId, name, now = new Date().toISOString()) {
  if (invite.status === "cancelled") throw new Error("This invite has been cancelled.");
  if (invite.creatorId === actorId) throw new Error("Hosts cannot apply to their own invite.");
  if (!invite.startsAt || !invite.timeZone) throw new Error("The host must confirm the meeting time zone first.");
  if (Date.parse(invite.startsAt) <= Date.parse(now)) throw new Error("This meeting has already started.");
  const applications = invite.applications || [];
  if (applications.some(a => a.applicantId === actorId)) return invite;
  if (applications.filter(a => a.status === "accepted").length >= (invite.capacity || 1)) throw new Error("All companion places are filled.");
  return {...invite, applications: [...applications, {id: crypto.randomUUID(), applicantId: actorId, applicantName: name, status:"pending", createdAt:now}]};
}
export function reviewInvite(invite, actorId, applicationId, status) {
  if (invite.creatorId !== actorId) throw new Error("Only the host can review applications.");
  if (invite.status === "cancelled") throw new Error("This invite has been cancelled.");
  if (!["accepted","declined"].includes(status)) throw new Error("Invalid application status.");
  const application = (invite.applications || []).find(a => a.id === applicationId);
  if (!application) throw new Error("Application not found.");
  if (application.status !== "pending") return invite;
  if (status === "accepted" && invite.applications.filter(a => a.status === "accepted").length >= (invite.capacity || 1)) throw new Error("All companion places are filled.");
  return {...invite, applications: invite.applications.map(a => a.id === applicationId ? {...a,status} : a)};
}
export function cancelInvite(invite, actorId) {
  if (invite.creatorId !== actorId) throw new Error("Only the host can cancel this invite.");
  return {...invite,status:"cancelled"};
}
