"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_EXPENSES, DEFAULT_INVITES, DEFAULT_MESSAGES, DEFAULT_PROFILE, DEFAULT_TRAVELERS, DEFAULT_TRIPS } from "@/lib/demo-data";
import type { Expense, Invite, Traveler, TravelerProfile, Trip, TripMessage } from "@/lib/types";

interface AppData {
  profile: TravelerProfile;
  trips: Trip[];
  messages: TripMessage[];
  expenses: Expense[];
  invites: Invite[];
  travelers: Traveler[];
}

interface AppContextValue extends AppData {
  ready: boolean;
  saveProfile: (profile: TravelerProfile) => void;
  createTrip: (trip: Omit<Trip, "id" | "organizer" | "participants" | "createdAt">) => string;
  requestToJoin: (tripId: string) => void;
  addMessage: (tripId: string, content: string) => void;
  addExpense: (tripId: string, description: string, amount: number) => void;
  createInvite: (invite: Omit<Invite, "id" | "creator">) => string;
  resetDemo: () => void;
}

const STORAGE_KEY = "solotrip-mate-v5";

const initialData: AppData = {
  profile: DEFAULT_PROFILE,
  trips: DEFAULT_TRIPS,
  messages: DEFAULT_MESSAGES,
  expenses: DEFAULT_EXPENSES,
  invites: DEFAULT_INVITES,
  travelers: DEFAULT_TRAVELERS,
};

const AppContext = createContext<AppContextValue | null>(null);

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        // Hydrate browser-only demo data after the server render to avoid a mismatch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(JSON.parse(saved) as AppData);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const value = useMemo<AppContextValue>(() => ({
    ...data,
    ready,
    saveProfile: (profile) => setData((current) => {
      const previousName = current.profile.nickname;
      return {
        ...current,
        profile,
        trips: current.trips.map((trip) => ({
          ...trip,
          organizer: trip.organizer === previousName ? profile.nickname : trip.organizer,
          participants: trip.participants.map((name) => name === previousName ? profile.nickname : name),
        })),
        messages: current.messages.map((message) => message.senderName === previousName ? { ...message, senderName: profile.nickname } : message),
        expenses: current.expenses.map((expense) => expense.payer === previousName ? { ...expense, payer: profile.nickname } : expense),
        invites: current.invites.map((invite) => invite.creator === previousName ? { ...invite, creator: profile.nickname } : invite),
      };
    }),
    createTrip: (trip) => {
      const id = makeId("trip");
      setData((current) => ({
        ...current,
        trips: [{ ...trip, id, organizer: current.profile.nickname, participants: [current.profile.nickname], createdAt: new Date().toISOString() }, ...current.trips],
      }));
      return id;
    },
    requestToJoin: (tripId) => setData((current) => ({
      ...current,
      trips: current.trips.map((trip) => trip.id === tripId && !trip.participants.includes(current.profile.nickname) && trip.participants.length < trip.maxParticipants
        ? { ...trip, participants: [...trip.participants, current.profile.nickname] }
        : trip),
    })),
    addMessage: (tripId, content) => setData((current) => ({
      ...current,
      messages: [...current.messages, { id: makeId("message"), tripId, senderName: current.profile.nickname, content, createdAt: new Date().toISOString() }],
    })),
    addExpense: (tripId, description, amount) => setData((current) => ({
      ...current,
      expenses: [...current.expenses, { id: makeId("expense"), tripId, description, amount, payer: current.profile.nickname, date: new Date().toISOString().slice(0, 10) }],
    })),
    createInvite: (invite) => {
      const id = makeId("invite");
      setData((current) => ({ ...current, invites: [{ ...invite, id, creator: current.profile.nickname }, ...current.invites] }));
      return id;
    },
    resetDemo: () => setData(initialData),
  }), [data, ready]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
