"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_EXPENSES, DEFAULT_INVITES, DEFAULT_MESSAGES, DEFAULT_PROFILE, DEFAULT_TRAVELERS, DEFAULT_TRIPS } from "@/lib/demo-data";
import type { Expense, Invite, Traveler, TravelerProfile, Trip, TripMessage } from "@/lib/types";
import { migrateBrowserData } from "@/lib/browser-migration.mjs";
import { applyInvite, reviewInvite, cancelInvite as cancelLocalInvite } from "@/lib/invite-actions.mjs";

interface AppData {
  profile: TravelerProfile;
  trips: Trip[];
  messages: TripMessage[];
  expenses: Expense[];
  invites: Invite[];
  travelers: Traveler[];
  localActorId: string;
}
type InviteMode = "loading" | "browser" | "shared" | "error";
type NewInvite = Omit<Invite, "id" | "creator" | "creatorId" | "applications" | "status" | "acceptedCount">;
interface AppContextValue extends AppData {
  ready: boolean;
  actorId: string;
  actorName: string;
  inviteMode: InviteMode;
  inviteError: string;
  simulateGuest: boolean;
  setSimulateGuest: (value: boolean) => void;
  saveProfile: (profile: TravelerProfile) => void;
  createTrip: (trip: Omit<Trip, "id" | "organizer" | "participants" | "createdAt">) => string;
  updateTrip: (tripId: string, update: Pick<Trip, "title" | "destination" | "startDate" | "endDate" | "description" | "maxParticipants" | "status" | "itinerary">) => void;
  requestToJoin: (tripId: string) => void;
  addMessage: (tripId: string, content: string) => void;
  addExpense: (tripId: string, description: string, amount: number) => void;
  createInvite: (invite: NewInvite) => Promise<string>;
  applyToInvite: (inviteId: string) => Promise<void>;
  reviewApplication: (inviteId: string, applicationId: string, status: "accepted" | "declined") => Promise<void>;
  cancelInvite: (inviteId: string) => Promise<void>;
  resetDemo: () => void;
}
const STORAGE_KEY = "solotrip-mate-v5";
const initialData: AppData = {
  profile: DEFAULT_PROFILE, trips: DEFAULT_TRIPS, messages: DEFAULT_MESSAGES,
  expenses: DEFAULT_EXPENSES, invites: DEFAULT_INVITES, travelers: DEFAULT_TRAVELERS, localActorId: "",
};
const AppContext = createContext<AppContextValue | null>(null);
const makeId = (prefix: string) => prefix + "-" + crypto.randomUUID();

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [ready, setReady] = useState(false);
  const [inviteMode, setInviteMode] = useState<InviteMode>("loading");
  const [inviteError, setInviteError] = useState("");
  const [sharedInvites, setSharedInvites] = useState<Invite[]>([]);
  const [sharedActorId, setSharedActorId] = useState("");
  const [simulateGuest, setSimulateGuest] = useState(false);

  useEffect(() => {
    let loaded = initialData;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { loaded = { ...initialData, ...JSON.parse(saved) }; }
      catch { window.localStorage.removeItem(STORAGE_KEY); }
    }
    setData(migrateBrowserData(loaded, initialData, makeId("browser")));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  useEffect(() => {
    let alive = true;
    let inFlight = false;
    const controller = new AbortController();
    async function refresh() {
      if (inFlight) return;
      inFlight = true;
      try {
        const response = await fetch("/api/local-invites", { cache: "no-store", signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Local invite service unavailable.");
        if (!alive) return;
        setInviteMode(result.enabled ? "shared" : "browser");
        setSharedActorId(result.actorId || "");
        setSharedInvites(result.invites || []);
        setInviteError("");
      } catch (error) {
        if (alive && !controller.signal.aborted) { setInviteMode("error"); setInviteError(error instanceof Error ? error.message : "Local invite service unavailable."); }
      } finally { inFlight = false; }
    }
    refresh();
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 4000);
    return () => { alive = false; controller.abort(); window.clearInterval(timer); };
  }, []);

  const actorId = inviteMode === "shared" ? sharedActorId : simulateGuest ? "guest-" + data.localActorId : data.localActorId;
  const actorName = simulateGuest && inviteMode === "browser" ? "Demo guest" : data.profile.nickname;
  const value = useMemo<AppContextValue>(() => {
    async function sharedAction(payload: object) {
      if (inviteMode !== "shared") throw new Error("The local shared test service is not available.");
      const response = await fetch("/api/local-invites", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Invite action failed.");
      const invite: Invite = result.invite;
      setSharedInvites(current => [invite, ...current.filter(i => i.id !== invite.id)]);
      return invite;
    }
    function localAction(id: string, change: (invite: Invite) => Invite) {
      const invite = data.invites.find(i => i.id === id);
      if (!invite) throw new Error("Invite not found.");
      const next = change(invite);
      setData(current => ({ ...current, invites: current.invites.map(i => i.id === id ? next : i) }));
    }
    return {
      ...data, invites: inviteMode === "shared" ? sharedInvites : data.invites,
      ready, actorId, actorName, inviteMode, inviteError, simulateGuest, setSimulateGuest,
      saveProfile: profile => setData(current => {
        const previousName = current.profile.nickname;
        return {
          ...current, profile,
          trips: current.trips.map(trip => ({ ...trip, organizer: trip.organizer === previousName ? profile.nickname : trip.organizer, participants: trip.participants.map(name => name === previousName ? profile.nickname : name) })),
          messages: current.messages.map(m => m.senderName === previousName ? { ...m, senderName: profile.nickname } : m),
          expenses: current.expenses.map(e => e.payer === previousName ? { ...e, payer: profile.nickname } : e),
          invites: current.invites.map(i => i.creatorId === current.localActorId ? { ...i, creator: profile.nickname } : i),
        };
      }),
      createTrip: trip => {
        const id = makeId("trip");
        setData(current => ({ ...current, trips: [{ ...trip, id, organizer: current.profile.nickname, participants: [current.profile.nickname], createdAt: new Date().toISOString() }, ...current.trips] }));
        return id;
      },
      updateTrip: (tripId, update) => setData(current => ({...current, trips: current.trips.map(trip => trip.id === tripId && trip.organizer === current.profile.nickname ? {...trip,...update} : trip)})),
      requestToJoin: tripId => setData(current => ({ ...current, trips: current.trips.map(trip => trip.id === tripId && !trip.participants.includes(current.profile.nickname) && trip.participants.length < trip.maxParticipants ? {...trip,participants:[...trip.participants,current.profile.nickname]} : trip) })),
      addMessage: (tripId, content) => setData(current => ({...current,messages:[...current.messages,{id:makeId("message"),tripId,senderName:current.profile.nickname,content,createdAt:new Date().toISOString()}]})),
      addExpense: (tripId, description, amount) => setData(current => ({...current,expenses:[...current.expenses,{id:makeId("expense"),tripId,description,amount,payer:current.profile.nickname,date:new Date().toISOString().slice(0,10)}]})),
      createInvite: async invite => {
        if (inviteMode === "loading" || inviteMode === "error") throw new Error("Wait for the invite service status before saving.");
        if (inviteMode === "shared") return (await sharedAction({action:"create",invite:{...invite,creator:data.profile.nickname}})).id;
        const id = makeId("invite");
        const created: Invite = {...invite,id,creator:actorName,creatorId:actorId,status:"open",applications:[]};
        setData(current => ({...current,invites:[created,...current.invites]}));
        return id;
      },
      applyToInvite: async inviteId => {
        if (inviteMode === "shared") { await sharedAction({action:"apply",inviteId,displayName:actorName}); return; }
        if (inviteMode !== "browser") throw new Error("Invite service unavailable.");
        localAction(inviteId, i => applyInvite(i, actorId, actorName));
      },
      reviewApplication: async (inviteId, applicationId, status) => {
        if (inviteMode === "shared") { await sharedAction({action:"review",inviteId,applicationId,status}); return; }
        if (inviteMode !== "browser") throw new Error("Invite service unavailable.");
        localAction(inviteId, i => reviewInvite(i, actorId, applicationId, status));
      },
      cancelInvite: async inviteId => {
        if (inviteMode === "shared") { await sharedAction({action:"cancel",inviteId}); return; }
        if (inviteMode !== "browser") throw new Error("Invite service unavailable.");
        localAction(inviteId, i => cancelLocalInvite(i, actorId));
      },
      resetDemo: () => {
        const localActorId = data.localActorId;
        setData({...initialData,localActorId,invites:DEFAULT_INVITES.map(i=>({...i,creatorId:i.creator===DEFAULT_PROFILE.nickname?localActorId:"seed-"+i.creator,status:"open",capacity:1,applications:[]}))});
        setSimulateGuest(false);
      },
    };
  }, [data, ready, actorId, actorName, inviteMode, inviteError, sharedInvites, simulateGuest]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
