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

## Phase 1 activity invitations

The default remains a **browser-only demo**. The persistent banner says that
nothing is sent to other people. Invitation details support explicitly labeled
single-browser host/guest role simulation; this is not cross-user delivery.

At 390px, bottom navigation keeps Plan, Invite, My trips and My invites available.
Existing private drafts can be edited. Save a plan, choose **Invite for this
activity**, confirm its public snapshot, meeting-place IANA time zone and companion
places, then save to its detail page. Only that selected activity is copied; the
private trip description, other stops and source trip IDs are not sent.
Applications require host confirmation and can be stopped by cancelling the invite.

Meeting time is stored as an explicit UTC instant plus the confirmed IANA zone and
displayed in that zone regardless of the viewer's browser zone. Existing unzoned
wall times remain **time zone unconfirmed (legacy)**, never an inferred zone.
A host can create a confirmed replacement. DST gaps are rejected; overlapping clock
times require an explicit first/second occurrence choice.

Missing coordinates mean **Not located · list only**. No Tokyo fallback or synthetic
route positions are generated. Changing the meeting place clears its inherited map
position and requires time-zone confirmation again.

### Optional local shared test

Node 22.13+ (validated with Node 24), no hosted service or account needed:

    SOLO_LOCAL_INVITES=1 SOLO_INVITES_DB=/absolute/path/to/disposable-invites.sqlite \
      npm run dev -- --hostname 127.0.0.1 --port 3126

This opt-in mode shares only public activity snapshots between local browser
sessions through SQLite. Private journeys remain browser-local. Identity uses
separate opaque HttpOnly SameSite cookies, not a display name. The API enforces
loopback Host and same-origin requests, owner-only review/cancellation and atomic
capacity checks. Companion capacity excludes the host. Cancellation removes the
invitation from non-host sessions. It does not distribute a public link.

Cookies last 30 days. Clearing/expiring a cookie loses that test identity; this is
not a production account or recovery system. Keep the server bound to loopback.
The existing Supabase example schema is **not enabled or applied** by this adapter;
its broad public SELECT policies are not used to share private trips.

### Checks

    npm test
    npm run lint
    npx tsc --noEmit --incremental false
    npm run build
    node tests/local-invites-next.mjs http://127.0.0.1:3126

Tests require Node 22.13+. The last check expects opt-in mode and a disposable
database. It creates and cancels its own synthetic invitation. See
[phase 1 acceptance](docs/phase1-acceptance.md) for executed checks and boundaries.
