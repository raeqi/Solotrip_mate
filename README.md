# Solotrip Mate 🌍

A comprehensive web application for solo travelers to find companions, plan trips, and split expenses.

## Features

- **User Profiles**: Create detailed traveler profiles with MBTI, driving ability, budget preferences
- **Trip Planning**: Build day-by-day itineraries with interactive maps
- **Companion Finding**: Browse and join trips, filter by solo-friendly vs group activities
- **Ad-hoc Invites**: Post quick meetups for meals or activities
- **Expense Splitting**: Track shared expenses and calculate settlements
- **Real-time Chat**: Communicate with trip companions
- **Payment Integration**: Mock payment flow for settling debts

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Maps**: React Leaflet (OpenStreetMap)
- **Backend**: Supabase (Auth, Database, Realtime)
- **Payments**: Stripe (mocked)

## Getting Started

### Prerequisites

- Node.js 25.2.1 or later
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure Supabase:
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

## License

MIT
