# Solotrip Mate 🌍

A solo-first travel workspace. Plan a complete trip for yourself, then invite companions for a whole trip or an individual activity when it makes sense.

## Features

- **User Profiles**: Create detailed traveler profiles with MBTI, driving ability, budget preferences
- **Trip Planning**: Build and persist day-by-day itineraries
- **Companion Finding**: Browse and join trips, filter by solo-friendly vs group activities
- **Ad-hoc Invites**: Post quick meetups for meals or activities
- **Expense Tracking**: Record shared trip expenses
- **Trip Chat**: Keep each trip conversation in context
- **Local Demo Mode**: Use the complete prototype without creating a backend project

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Maps**: React Leaflet (OpenStreetMap)
- **Prototype Storage**: Browser local storage
- **Production Backend Schema**: Supabase SQL with Row Level Security policies

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. The app runs immediately in local demo mode and saves changes in the browser. For backend development, configure Supabase:
   - Copy `env.example` to `.env.local`
   - Add your Supabase credentials
   - Run the schema in `supabase/schema.sql`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── auth/              # Login/Signup
│   ├── explore/           # Map and companion finding
│   ├── invites/           # Ad-hoc invites
│   ├── payment/           # Payment flow
│   ├── profile/           # User profile
│   └── trips/             # Trip details, chat, expenses
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── map/               # Map component
│   └── ui/                # Reusable UI components
└── lib/                   # Utilities, Supabase client
```

## Key Pages

- `/` - Landing page
- `/explore` - Browse trips and solo-friendly spots
- `/profile` - Create/edit user profile
- `/trips/create` - Plan a new trip
- `/trips/[id]` - Trip details
- `/trips/[id]/chat` - Trip chat
- `/trips/[id]/expenses` - Expense tracking
- `/invites/create` - Create ad-hoc invite
- `/auth` - Login/Signup
- `/payment` - Payment settlement

## Prototype behavior

Trips, profile updates, chat messages, expenses, quick invites, and traveler profiles persist in the current browser under the `solotrip-mate-v5` key. Use **Reset demo** on the dashboard to restore the seed data. This keeps the validation build usable without credentials while the Supabase adapter is developed.

## License

MIT
