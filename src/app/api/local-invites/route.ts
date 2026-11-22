import { handleLocalInviteRequest } from '@/lib/local-invites-server.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  return handleLocalInviteRequest(request);
}

export function POST(request: Request) {
  return handleLocalInviteRequest(request);
}
