"use client";
import Link from "next/link";
import {useApp} from "@/components/providers/AppProvider";
import {formatInviteTime} from "@/lib/invite-time.mjs";
import type {Invite} from "@/lib/types";
export default function InvitesPage(){
 const {ready,invites,actorId,inviteMode,inviteError}=useApp();
 if(!ready||inviteMode==="loading")return <p className="p-8">Loading invites…</p>;
 const active=invites.filter(i=>i.status!=="cancelled");
 const groups:[string,Invite[]][]=[
  ["Hosted by you",invites.filter(i=>i.creatorId===actorId)],
  ["Your applications",active.filter(i=>(i.applications||[]).some(a=>a.applicantId===actorId))],
  ["Available activities",active.filter(i=>i.creatorId!==actorId)],
 ];
 return <div className="mx-auto max-w-4xl space-y-8 px-4 py-8"><div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-bold">My invites</h1><Link href="/invites/create" className="rounded bg-primary px-4 py-3 text-sm text-white">Create an activity invite</Link></div><p className="text-sm text-muted-foreground">Your private plans stay in My trips. Only separately saved activity snapshots appear here.</p>{inviteMode==="error"&&<p role="alert">{inviteError}</p>}{groups.map(([title,items])=><section key={title} className="space-y-3"><h2 className="text-xl font-semibold">{title}</h2>{items.length?items.map(i=><Link key={i.id} href={"/invites/"+i.id} className="block rounded-xl border bg-white p-4"><h3 className="font-bold">{i.title}</h3><p className="mt-2 text-sm">{i.location} · {formatInviteTime(i)}</p><p className="mt-2 text-sm text-muted-foreground">{i.status==="cancelled"?"Cancelled":((i.acceptedCount??i.applications?.filter(a=>a.status==="accepted").length??0)+"/"+(i.capacity||1)+" companion places confirmed")}{!i.coordinates?" · Not located":""}</p></Link>):<p className="text-sm text-muted-foreground">None yet.</p>}</section>)}</div>;
}
