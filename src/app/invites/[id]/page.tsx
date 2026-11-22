"use client";
import {useState} from "react";
import {useParams} from "next/navigation";
import Link from "next/link";
import {useApp} from "@/components/providers/AppProvider";
import {Button} from "@/components/ui/button";
import {formatInviteTime} from "@/lib/invite-time.mjs";
export default function InviteDetailsPage() {
  const {id}=useParams<{id:string}>();
  const {ready,invites,actorId,actorName,inviteMode,inviteError,simulateGuest,setSimulateGuest,applyToInvite,reviewApplication,cancelInvite}=useApp();
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[confirmCancel,setConfirmCancel]=useState(false);
  if (!ready||inviteMode==="loading") return <p className="p-8">Loading invite…</p>;
  if(inviteMode==="error") return <p role="alert" className="p-8">{inviteError} <Link href="/invites" className="underline">My invites</Link></p>;
  const invite=invites.find(i=>i.id===id);
  const own=invite?.creatorId===actorId;
  if(!invite||(invite.status==="cancelled"&&!own)) return <div className="p-8"><h1 className="text-2xl font-bold">Invite unavailable</h1><p className="mt-3">It may be cancelled, or belong to another browser-only demo.</p><Link href="/invites" className="mt-4 inline-block underline">View invites</Link></div>;
  const applications=invite.applications||[];
  const mine=applications.find(a=>a.applicantId===actorId);
  const accepted=invite.acceptedCount??applications.filter(a=>a.status==="accepted").length;
  const validTime=!!invite.startsAt&&!!invite.timeZone;
  const past=validTime&&Date.parse(invite.startsAt!)<=Date.now();
  async function run(action:()=>Promise<void>){setBusy(true);setError("");try{await action();}catch(e){setError(e instanceof Error?e.message:"Action failed.");}finally{setBusy(false);}}
  return <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
    <p role="status" className="rounded border bg-teal-50 p-3 text-sm">{inviteMode==="browser"?"Saved in this browser only. No invitation was sent.":own?"Saved to the local shared test on this computer. No public sharing.":"Local shared activity snapshot. Your private plans are separate."}</p>
    <div className="flex flex-wrap gap-4 text-sm"><Link href="/invites" className="underline">My invites</Link><Link href="/explore" className="underline">Explore</Link></div>
    <h1 className="text-3xl font-bold">{invite.title}</h1>
    <p className="font-semibold">{invite.status==="cancelled"?"Cancelled":"Activity invite"} · Hosted by {invite.creator}</p>
    <p>{invite.location}</p><p>{formatInviteTime(invite)}</p>
    <p className="text-sm text-muted-foreground">{invite.coordinates?"Confirmed activity map position":"Not located · list only; no map pin"}</p>
    <p>{accepted}/{invite.capacity||1} companion places confirmed</p>
    <p className="whitespace-pre-wrap rounded-xl border bg-white p-4">{invite.note||"No public note."}</p>
    {!validTime&&<p className="rounded border border-amber-300 p-3 text-sm">This legacy record has no confirmed time zone. Applications are unavailable until the host creates a confirmed replacement. {own&&<Link className="underline" href={"/invites/create?replace="+invite.id}>Confirm a replacement invite</Link>}</p>}
    {inviteMode==="browser"&&<div className="rounded border border-dashed p-4 text-sm"><p>Single-browser role simulation · currently {simulateGuest?"Demo guest":"host/profile"} ({actorName}). This does not test cross-user delivery.</p><Button className="mt-3" variant="outline" disabled={busy} onClick={()=>setSimulateGuest(!simulateGuest)}>{simulateGuest?"Return to host role":"Simulate another traveler"}</Button></div>}
    {!own&&invite.status!=="cancelled"&&<div className="rounded-xl border bg-white p-4"><h2 className="text-xl font-semibold">Your participation</h2><p className="my-3">{mine?"Application "+mine.status:"Ask to join only this activity. The host must confirm your request."}</p>{!mine&&<Button disabled={busy||!validTime||past||accepted>=(invite.capacity||1)} onClick={()=>run(()=>applyToInvite(invite.id))}>{past?"Meeting has started":"Apply for this activity"}</Button>}</div>}
    {own&&<section className="space-y-3 rounded-xl border bg-white p-4"><h2 className="text-xl font-semibold">Applications</h2>{applications.length?applications.map(a=><div key={a.id} className="flex flex-wrap items-center justify-between gap-3 border-b py-3"><p>{a.applicantName} · {a.status}</p>{a.status==="pending"&&invite.status!=="cancelled"&&<div className="flex gap-2"><Button disabled={busy||accepted>=(invite.capacity||1)||past} onClick={()=>run(()=>reviewApplication(invite.id,a.id,"accepted"))}>Confirm {a.applicantName}</Button><Button variant="outline" disabled={busy} onClick={()=>run(()=>reviewApplication(invite.id,a.id,"declined"))}>Decline {a.applicantName}</Button></div>}</div>):<p>No applications yet.</p>}{invite.status!=="cancelled"&&(confirmCancel?<div className="space-y-3"><p>Cancel this invite? New applications and confirmations will stop, and it will no longer open for other local sessions.</p><Button variant="destructive" disabled={busy} onClick={()=>run(()=>cancelInvite(invite.id))}>Confirm cancellation</Button> <Button variant="outline" onClick={()=>setConfirmCancel(false)}>Keep invite</Button></div>:<Button variant="outline" disabled={busy} onClick={()=>setConfirmCancel(true)}>Cancel invite</Button>)}</section>}
    {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
  </div>;
}
