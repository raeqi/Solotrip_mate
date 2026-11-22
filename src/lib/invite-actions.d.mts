import type { Invite } from "./types";
export function applyInvite(invite: Invite, actorId: string, name: string, now?: string): Invite;
export function reviewInvite(invite: Invite, actorId: string, applicationId: string, status: "accepted" | "declined"): Invite;
export function cancelInvite(invite: Invite, actorId: string): Invite;
