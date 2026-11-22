export interface PublicApplication {
  id: string; applicantId: string; applicantName: string;
  status: 'pending' | 'accepted' | 'declined'; createdAt: string;
}
export interface PublicInvite {
  id: string; type: 'meal' | 'activity'; title: string; location: string;
  scheduledTime: string; startsAt: string; timeZone: string; note: string;
  creator: string; creatorId: string; capacity: number; status: 'open' | 'cancelled';
  applications: PublicApplication[]; acceptedCount: number; coordinates?: [number, number];
}
export interface InviteStore {
  close(): void;
  session(token?: string, create?: boolean): { actorId: string; token: string; created: boolean };
  list(actor: string): PublicInvite[];
  create(actor: string, input: unknown): PublicInvite;
  apply(actor: string, inviteId: string, displayName: string): PublicInvite;
  review(actor: string, inviteId: string, applicationId: string, status: 'accepted' | 'declined'): PublicInvite;
  cancel(actor: string, inviteId: string): PublicInvite;
}
export class InviteError extends Error { status: number; constructor(message: string, status?: number); }
export function createInviteStore(filename: string, options?: { clock?: () => number }): Promise<InviteStore>;
export function validateLocalRequest(request: Request, mutation?: boolean): void;
export function handleLocalInviteRequest(request: Request, options?: { enabled?: boolean; store?: InviteStore }): Promise<Response>;
