export function migrateBrowserData<T extends {localActorId: string;profile:{nickname:string};invites:import("./types").Invite[]}>(saved: Partial<T>, defaults: T, newActorId: string): T;
