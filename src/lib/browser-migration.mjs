// Preserve v5 private journeys and legacy wall times; only add local demo identity/state.
export function migrateBrowserData(saved, defaults, newActorId) {
  const data = {...defaults,...saved};
  const localActorId = data.localActorId || newActorId;
  const invites = (Array.isArray(data.invites) ? data.invites : defaults.invites).map(invite=>({
    ...invite,
    creatorId: invite.creatorId || (invite.creator===data.profile.nickname?localActorId:"seed-"+invite.creator),
    capacity: invite.capacity || 1,
    status: invite.status || "open",
    applications: invite.applications || [],
  }));
  return {...data,localActorId,invites};
}
