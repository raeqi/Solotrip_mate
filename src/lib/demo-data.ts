import type { Expense, Invite, Traveler, TravelerProfile, Trip, TripMessage } from "@/lib/types";

export const DEFAULT_PROFILE: TravelerProfile = {
  nickname: "AlexExplorer",
  mbti: "ENFP",
  drivingAbility: "yes",
  budgetSensitivity: "moderate",
  soloExperience: "intermediate",
  countriesVisited: "Japan, Switzerland, France, Thailand, Spain",
};

export const DEFAULT_TRAVELERS: Traveler[] = [
  { id: "alex-explorer", nickname: "AlexExplorer", avatarSeed: "Alex", homeBase: "Shanghai", bio: "Flexible solo traveler who enjoys food, mountain views, and leaving room for spontaneous plans.", mbti: "ENFP", drivingAbility: "yes", budgetSensitivity: "moderate", soloExperience: "intermediate", countriesVisited: "Japan, Switzerland, France, Thailand, Spain", interests: ["Food", "Hiking", "Photography"], languages: ["Mandarin", "English"], verified: true, rating: 4.8, tripsCompleted: 12, points: 3280 },
  { id: "travelbuddy", nickname: "TravelBuddy", avatarSeed: "Felix", homeBase: "Singapore", bio: "Weekend explorer who plans around local food and street photography.", mbti: "INTJ", drivingAbility: "yes", budgetSensitivity: "moderate", soloExperience: "expert", countriesVisited: "Japan, Vietnam, Taiwan, Australia", interests: ["Street food", "Photography", "Coffee"], languages: ["English", "Mandarin"], verified: true, rating: 4.9, tripsCompleted: 18, points: 4680 },
  { id: "sam-roams", nickname: "Sam", avatarSeed: "Sam", homeBase: "Melbourne", bio: "Museum mornings, long walks, and spontaneous dinner plans.", mbti: "INFP", drivingAbility: "no", budgetSensitivity: "moderate", soloExperience: "intermediate", countriesVisited: "Japan, Italy, New Zealand", interests: ["Museums", "Food", "Walking"], languages: ["English"], verified: true, rating: 4.8, tripsCompleted: 9, points: 2410 },
  { id: "maya-moves", nickname: "MayaMoves", avatarSeed: "Maya", homeBase: "Toronto", bio: "Remote designer chasing warm water, beginner waves, and calm workspaces.", mbti: "ENFP", drivingAbility: "passenger", budgetSensitivity: "moderate", soloExperience: "expert", countriesVisited: "Indonesia, Portugal, Mexico, Costa Rica", interests: ["Surfing", "Design", "Wellness"], languages: ["English", "French"], verified: true, rating: 4.9, tripsCompleted: 24, points: 5920 },
  { id: "min-move", nickname: "MinOnTheMove", avatarSeed: "Aneka", homeBase: "Seoul", bio: "Local design guide and specialty-coffee obsessive.", mbti: "ENTJ", drivingAbility: "yes", budgetSensitivity: "moderate", soloExperience: "expert", countriesVisited: "South Korea, Japan, Denmark, Finland", interests: ["Architecture", "Coffee", "Markets"], languages: ["Korean", "English", "Japanese"], verified: true, rating: 5, tripsCompleted: 31, points: 7840 },
  { id: "road-nomad", nickname: "RoadNomad", avatarSeed: "Jack", homeBase: "Barcelona", bio: "Road-trip organizer, sunrise hiker, and confident mountain driver.", mbti: "ESTP", drivingAbility: "yes", budgetSensitivity: "budget", soloExperience: "expert", countriesVisited: "Morocco, Spain, France, Turkey", interests: ["Road trips", "Hiking", "Camping"], languages: ["Spanish", "English", "French"], verified: true, rating: 4.7, tripsCompleted: 22, points: 5170 },
  { id: "nora-north", nickname: "Nora", avatarSeed: "Nora", homeBase: "Stockholm", bio: "Slow traveler interested in ceramics, bookstores, and neighborhood life.", mbti: "ISFP", drivingAbility: "no", budgetSensitivity: "moderate", soloExperience: "intermediate", countriesVisited: "South Korea, Germany, Estonia, Greece", interests: ["Ceramics", "Books", "Culture"], languages: ["Swedish", "English"], verified: false, rating: 4.6, tripsCompleted: 7, points: 1820 },
  { id: "leo-trails", nickname: "Leo", avatarSeed: "Leo", homeBase: "Munich", bio: "Trail runner who is equally happy with an easy scenic day.", mbti: "ISTJ", drivingAbility: "yes", budgetSensitivity: "budget", soloExperience: "expert", countriesVisited: "Switzerland, Austria, Nepal, Norway", interests: ["Hiking", "Running", "Nature"], languages: ["German", "English"], verified: true, rating: 4.9, tripsCompleted: 27, points: 6350 },
  { id: "elena-away", nickname: "Elena", avatarSeed: "Lola", homeBase: "Lisbon", bio: "Documentary photographer traveling slowly across North Africa and Southern Europe.", mbti: "INFJ", drivingAbility: "yes", budgetSensitivity: "budget", soloExperience: "expert", countriesVisited: "Morocco, Tunisia, Italy, Georgia", interests: ["Photography", "History", "Local food"], languages: ["Portuguese", "English", "Spanish"], verified: true, rating: 4.8, tripsCompleted: 19, points: 4420 },
];

export const DEFAULT_TRIPS: Trip[] = [
  {
    id: "tokyo-foodie",
    title: "Tokyo Food & Photo Weekend",
    destination: "Tokyo, Japan",
    startDate: "2026-10-15",
    endDate: "2026-10-18",
    description: "A relaxed weekend for street food, film photography, and hidden ramen shops. Join one activity or stay for the whole trip.",
    maxParticipants: 5,
    status: "recruiting",
    organizer: "TravelBuddy",
    participants: ["TravelBuddy", "Sam"],
    createdAt: "2026-08-12T08:00:00.000Z",
    coordinates: [35.6762, 139.6503],
    itinerary: [
      { id: "tokyo-day-1", date: "2026-10-15", items: [
        { id: "tokyo-1", time: "10:00", activity: "Shinjuku photo walk", location: "Shinjuku South Exit", openToCompanions: true, coordinates: [35.6897, 139.7006] },
        { id: "tokyo-2", time: "12:30", activity: "Yakitori lunch", location: "Omoide Yokocho", openToCompanions: true, coordinates: [35.693, 139.6996] },
        { id: "tokyo-3", time: "18:00", activity: "Check in and rest", location: "Asakusa", openToCompanions: false, coordinates: [35.7148, 139.7967] },
      ] },
      { id: "tokyo-day-2", date: "2026-10-16", items: [
        { id: "tokyo-4", time: "09:30", activity: "Meiji Shrine walk", location: "Meiji Jingu", openToCompanions: true, coordinates: [35.6764, 139.6993] },
        { id: "tokyo-5", time: "15:00", activity: "Coffee and record stores", location: "Shimokitazawa", openToCompanions: true, coordinates: [35.6616, 139.6673] },
      ] },
    ],
  },
  {
    id: "swiss-hike",
    title: "Swiss Alps Hiking Week",
    destination: "Interlaken, Switzerland",
    startDate: "2026-11-01",
    endDate: "2026-11-07",
    description: "Day hikes from Interlaken with flexible rest days and a moderate budget.",
    maxParticipants: 4,
    status: "confirmed",
    organizer: "AlexExplorer",
    participants: ["AlexExplorer", "Mia", "Leo"],
    createdAt: "2026-08-20T08:00:00.000Z",
    coordinates: [46.6863, 7.8632],
    itinerary: [
      { id: "swiss-day-1", date: "2026-11-01", items: [
        { id: "swiss-1", time: "11:00", activity: "Arrive and check in", location: "Interlaken Ost", openToCompanions: false, coordinates: [46.6908, 7.869] },
        { id: "swiss-2", time: "15:30", activity: "Lake Brienz sunset walk", location: "Bönigen", openToCompanions: true, coordinates: [46.6885, 7.8936] },
      ] },
      { id: "swiss-day-2", date: "2026-11-02", items: [
        { id: "swiss-3", time: "08:00", activity: "First to Bachalpsee hike", location: "Grindelwald First", openToCompanions: true, coordinates: [46.6601, 8.0533] },
      ] },
    ],
  },
  {
    id: "bali-workation",
    title: "Bali Workation & Surf",
    destination: "Canggu, Indonesia",
    startDate: "2026-10-05",
    endDate: "2026-10-19",
    description: "Two weeks of remote work, beginner surf sessions, and slow weekends. Quiet mornings are important.",
    maxParticipants: 4,
    status: "recruiting",
    organizer: "MayaMoves",
    participants: ["MayaMoves"],
    createdAt: "2026-09-01T09:00:00.000Z",
    coordinates: [-8.6478, 115.1385],
    itinerary: [
      { id: "bali-day-1", date: "2026-10-05", items: [
        { id: "bali-1", time: "08:00", activity: "Beginner surf lesson", location: "Batu Bolong Beach", openToCompanions: true, coordinates: [-8.6596, 115.13] },
        { id: "bali-2", time: "13:00", activity: "Coworking session", location: "Canggu", openToCompanions: false, coordinates: [-8.6478, 115.1385] },
      ] },
    ],
  },
  {
    id: "seoul-design",
    title: "Seoul Design, Coffee & Night Markets",
    destination: "Seoul, South Korea",
    startDate: "2026-09-28",
    endDate: "2026-10-03",
    description: "Architecture, independent design shops, specialty coffee, and casual night-market dinners.",
    maxParticipants: 6,
    status: "recruiting",
    organizer: "MinOnTheMove",
    participants: ["MinOnTheMove", "Nora", "Jules"],
    createdAt: "2026-09-03T12:00:00.000Z",
    coordinates: [37.5665, 126.978],
    itinerary: [
      { id: "seoul-day-1", date: "2026-09-28", items: [
        { id: "seoul-1", time: "10:30", activity: "DDP architecture tour", location: "Dongdaemun Design Plaza", openToCompanions: true, coordinates: [37.567, 127.0095] },
        { id: "seoul-2", time: "19:00", activity: "Gwangjang food crawl", location: "Gwangjang Market", openToCompanions: true, coordinates: [37.5701, 126.9996] },
      ] },
    ],
  },
  {
    id: "kyoto-solo",
    title: "Quiet Kyoto Autumn Escape",
    destination: "Kyoto, Japan",
    startDate: "2026-11-18",
    endDate: "2026-11-23",
    description: "A mostly solo trip with early temple visits. Open to company for two dinners and one countryside walk.",
    maxParticipants: 3,
    status: "draft",
    organizer: "AlexExplorer",
    participants: ["AlexExplorer"],
    createdAt: "2026-09-08T06:00:00.000Z",
    coordinates: [35.0116, 135.7681],
    itinerary: [
      { id: "kyoto-day-1", date: "2026-11-18", items: [
        { id: "kyoto-1", time: "07:00", activity: "Kiyomizu-dera before crowds", location: "Kiyomizu-dera", openToCompanions: false, coordinates: [34.9949, 135.785] },
        { id: "kyoto-2", time: "18:30", activity: "Obanzai dinner", location: "Gion", openToCompanions: true, coordinates: [35.0037, 135.7788] },
      ] },
    ],
  },
  {
    id: "morocco-roadtrip",
    title: "Morocco Desert Road Trip",
    destination: "Marrakesh, Morocco",
    startDate: "2026-12-03",
    endDate: "2026-12-11",
    description: "A shared rental-car route through Aït Benhaddou and the Sahara. Looking for confident drivers.",
    maxParticipants: 4,
    status: "recruiting",
    organizer: "RoadNomad",
    participants: ["RoadNomad", "Elena"],
    createdAt: "2026-09-09T10:00:00.000Z",
    coordinates: [31.6295, -7.9811],
    itinerary: [
      { id: "morocco-day-1", date: "2026-12-03", items: [
        { id: "morocco-1", time: "09:00", activity: "Pick up rental car", location: "Marrakesh Airport", openToCompanions: true, coordinates: [31.6069, -8.0363] },
        { id: "morocco-2", time: "15:00", activity: "Kasbah walk", location: "Aït Benhaddou", openToCompanions: true, coordinates: [31.0472, -7.1298] },
      ] },
    ],
  },
  {
    id: "lisbon-creative",
    title: "Lisbon Creative Long Weekend",
    destination: "Lisbon, Portugal",
    startDate: "2026-10-22",
    endDate: "2026-10-26",
    description: "Tile workshops, neighborhood walks, miradouros, and unhurried seafood dinners.",
    maxParticipants: 5,
    status: "recruiting",
    organizer: "Elena",
    participants: ["Elena", "Nora"],
    createdAt: "2026-09-10T10:00:00.000Z",
    coordinates: [38.7223, -9.1393],
    itinerary: [
      { id: "lisbon-day-1", date: "2026-10-22", items: [
        { id: "lisbon-1", time: "10:00", activity: "Alfama photo walk", location: "Portas do Sol", openToCompanions: true, coordinates: [38.7125, -9.1302] },
        { id: "lisbon-2", time: "16:00", activity: "Azulejo workshop", location: "Mouraria", openToCompanions: true, coordinates: [38.7168, -9.1346] },
      ] },
    ],
  },
  {
    id: "chiang-mai-slow",
    title: "Slow Week in Chiang Mai",
    destination: "Chiang Mai, Thailand",
    startDate: "2026-12-12",
    endDate: "2026-12-20",
    description: "Markets, cafés, easy scooter day trips, and plenty of unscheduled time.",
    maxParticipants: 4,
    status: "recruiting",
    organizer: "Sam",
    participants: ["Sam"],
    createdAt: "2026-09-11T03:00:00.000Z",
    coordinates: [18.7883, 98.9853],
    itinerary: [
      { id: "chiang-day-1", date: "2026-12-12", items: [
        { id: "chiang-1", time: "09:00", activity: "Old City breakfast walk", location: "Tha Phae Gate", openToCompanions: true, coordinates: [18.7877, 99.0005] },
        { id: "chiang-2", time: "17:30", activity: "Doi Suthep sunset", location: "Wat Phra That Doi Suthep", openToCompanions: true, coordinates: [18.8048, 98.9216] },
      ] },
    ],
  },
];

export const DEFAULT_MESSAGES: TripMessage[] = [
  { id: "message-1", tripId: "tokyo-foodie", senderName: "Sam", content: "Really excited for the Tokyo trip. Is anyone vegetarian?", createdAt: "2026-09-12T02:00:00.000Z" },
  { id: "message-2", tripId: "tokyo-foodie", senderName: "TravelBuddy", content: "I added two food stops with vegetarian options.", createdAt: "2026-09-12T02:05:00.000Z" },
  { id: "message-3", tripId: "swiss-hike", senderName: "Mia", content: "I checked the trail conditions. Microspikes might be useful.", createdAt: "2026-09-11T07:20:00.000Z" },
  { id: "message-4", tripId: "swiss-hike", senderName: "Leo", content: "I can bring an extra pair.", createdAt: "2026-09-11T07:34:00.000Z" },
  { id: "message-5", tripId: "swiss-hike", senderName: "AlexExplorer", content: "Great, I will update the packing checklist.", createdAt: "2026-09-11T07:40:00.000Z" },
];

export const DEFAULT_EXPENSES: Expense[] = [
  { id: "expense-1", tripId: "tokyo-foodie", description: "Dinner reservation deposit", amount: 120, payer: "TravelBuddy", date: "2026-10-15" },
  { id: "expense-2", tripId: "tokyo-foodie", description: "Airport train tickets", amount: 45, payer: "Sam", date: "2026-10-15" },
  { id: "expense-3", tripId: "swiss-hike", description: "Apartment deposit", amount: 480, payer: "AlexExplorer", date: "2026-09-08" },
  { id: "expense-4", tripId: "swiss-hike", description: "Regional train passes", amount: 238.5, payer: "Mia", date: "2026-09-10" },
  { id: "expense-5", tripId: "swiss-hike", description: "Trail snacks", amount: 37.8, payer: "Leo", date: "2026-11-02" },
];

export const DEFAULT_INVITES: Invite[] = [
  { id: "invite-1", type: "meal", title: "Tsukiji breakfast meetup", location: "Tsukiji Outer Market, Tokyo", scheduledTime: "2026-10-16T08:00", note: "Small group, seafood lovers welcome.", creator: "TravelBuddy", coordinates: [35.6655, 139.7708] },
  { id: "invite-2", type: "activity", title: "Sunset photo walk", location: "Shibuya Sky, Tokyo", scheduledTime: "2026-10-16T16:30", note: "Bringing a film camera; phones are welcome too.", creator: "Sam", coordinates: [35.658, 139.7016] },
  { id: "invite-3", type: "meal", title: "Gwangjang market food crawl", location: "Gwangjang Market, Seoul", scheduledTime: "2026-09-29T19:00", note: "Let’s try several stalls and split everything.", creator: "MinOnTheMove", coordinates: [37.5701, 126.9996] },
  { id: "invite-4", type: "activity", title: "Beginner surf session", location: "Batu Bolong Beach, Bali", scheduledTime: "2026-10-06T08:00", note: "Lesson booked; two more spots available.", creator: "MayaMoves", coordinates: [-8.6596, 115.13] },
  { id: "invite-5", type: "meal", title: "Kyoto obanzai dinner", location: "Gion, Kyoto", scheduledTime: "2026-11-18T18:30", note: "Quiet dinner, moderate budget.", creator: "AlexExplorer", coordinates: [35.0037, 135.7788] },
  { id: "invite-6", type: "activity", title: "Lake Brienz easy walk", location: "Bönigen, Switzerland", scheduledTime: "2026-11-01T15:30", note: "Weather permitting; about 90 minutes.", creator: "AlexExplorer", coordinates: [46.6885, 7.8936] },
  { id: "invite-7", type: "activity", title: "Alfama golden-hour photo walk", location: "Portas do Sol, Lisbon", scheduledTime: "2026-10-22T17:00", note: "Relaxed pace with a pastel-de-nata stop.", creator: "Elena", coordinates: [38.7125, -9.1302] },
  { id: "invite-8", type: "meal", title: "Northern Thai dinner", location: "Chang Phueak Gate, Chiang Mai", scheduledTime: "2026-12-12T19:00", note: "Ordering family-style so we can try more dishes.", creator: "Sam", coordinates: [18.7954, 98.9858] },
];
