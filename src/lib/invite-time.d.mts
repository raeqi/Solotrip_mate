export function validTimeZone(zone: unknown): boolean;
export function resolveMeetingTime(wall: string, zone: string, occurrence?: string): string;
export function formatInviteTime(invite: {startsAt?: string; timeZone?: string; scheduledTime?: string}, locale?: string): string;
