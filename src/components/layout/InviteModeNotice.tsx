"use client";
import { useApp } from "@/components/providers/AppProvider";
export function InviteModeNotice() {
  const {inviteMode,inviteError} = useApp();
  return <p role="status" className="border-b bg-amber-50 px-4 py-2 text-center text-xs leading-5 text-amber-950">
    {inviteMode === "shared" ? "Local shared test · Public activity snapshots are visible to other sessions on this computer. No public link or hosted accounts."
      : inviteMode === "error" ? "Invite service unavailable: "+inviteError+" No changes will be sent."
      : inviteMode === "loading" ? "Checking local invite mode…"
      : "Browser-only demo · Invites and applications stay in this browser. Nothing is sent to other people."}
  </p>;
}
