export type TripStatus = "draft" | "recruiting" | "confirmed";

export interface TravelerProfile {
  nickname: string;
  mbti: string;
  drivingAbility: "yes" | "no" | "passenger";
  budgetSensitivity: "budget" | "moderate" | "luxury";
  soloExperience: "beginner" | "intermediate" | "expert";
  countriesVisited: string;
}

export interface Traveler extends TravelerProfile {
  id: string;
  avatarSeed: string;
  homeBase: string;
  bio: string;
  interests: string[];
  languages: string[];
  verified: boolean;
  rating: number;
  tripsCompleted: number;
  points: number;
}

export interface ItineraryItem {
  id: string;
  time: string;
  activity: string;
  location: string;
  openToCompanions: boolean;
  coordinates?: [number, number];
}

export interface DayPlan {
  id: string;
  date: string;
  items: ItineraryItem[];
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  maxParticipants: number;
  status: TripStatus;
  organizer: string;
  participants: string[];
  itinerary: DayPlan[];
  createdAt: string;
  coordinates?: [number, number];
}

export interface TripMessage {
  id: string;
  tripId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  tripId: string;
  description: string;
  amount: number;
  payer: string;
  date: string;
}

export interface InviteApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface Invite {
  id: string;
  type: "meal" | "activity";
  title: string;
  location: string;
  scheduledTime: string; // Legacy raw wall time, or normalized UTC in shared mode; display startsAt + timeZone.
  startsAt?: string;
  timeZone?: string;
  capacity?: number; // Companion places, excluding the host.
  status?: "open" | "cancelled";
  applications?: InviteApplication[];
  acceptedCount?: number;
  creatorId?: string;
  note: string;
  creator: string;
  coordinates?: [number, number];
}
