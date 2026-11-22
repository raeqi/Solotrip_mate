-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname text,
  mbti text,
  driving_ability text,
  budget_sensitivity text,
  solo_experience text,
  countries_visited text,
  avatar_url text,
  level text default 'Travel Novice',
  points integer default 0,
  badges text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trips table
create table public.trips (
  id uuid default gen_random_uuid() primary key,
  organizer_id uuid references public.profiles(id) on delete cascade not null,
  destination text not null,
  start_date date,
  end_date date,
  description text,
  max_participants integer default 4,
  status text default 'recruiting',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trip participants
create table public.trip_participants (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'pending',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(trip_id, user_id)
);

-- Itinerary items
create table public.itinerary_items (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  day_number integer not null,
  time text,
  activity text not null,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ad-hoc invites
create table public.invites (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- 'meal' or 'activity'
  title text not null,
  location text,
  scheduled_time timestamp with time zone,
  valid_until timestamp with time zone not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Expenses
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  payer_id uuid references public.profiles(id) on delete cascade not null,
  description text not null,
  amount numeric(10, 2) not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chat messages
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_participants enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.invites enable row level security;
alter table public.expenses enable row level security;
alter table public.messages enable row level security;

-- RLS Policies (basic examples)
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can create own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Trips are viewable by everyone"
  on public.trips for select
  using (true);

create policy "Users can create own trips"
  on public.trips for insert
  with check (auth.uid() = organizer_id);

create policy "Organizers can update own trips"
  on public.trips for update
  using (auth.uid() = organizer_id);

create policy "Participants are viewable by everyone"
  on public.trip_participants for select
  using (true);

create policy "Users can request to join trips"
  on public.trip_participants for insert
  with check (auth.uid() = user_id);

create policy "Itineraries are viewable by everyone"
  on public.itinerary_items for select
  using (true);

create policy "Trip organizers can manage itinerary items"
  on public.itinerary_items for all
  using (exists (
    select 1 from public.trips
    where trips.id = itinerary_items.trip_id
      and trips.organizer_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.trips
    where trips.id = itinerary_items.trip_id
      and trips.organizer_id = auth.uid()
  ));

create policy "Invites are viewable by everyone"
  on public.invites for select
  using (true);

create policy "Users can create own invites"
  on public.invites for insert
  with check (auth.uid() = creator_id);

create policy "Trip members can view expenses"
  on public.expenses for select
  using (
    auth.uid() = payer_id or exists (
      select 1 from public.trip_participants
      where trip_participants.trip_id = expenses.trip_id
        and trip_participants.user_id = auth.uid()
        and trip_participants.status = 'accepted'
    )
  );

create policy "Trip members can add expenses"
  on public.expenses for insert
  with check (auth.uid() = payer_id);

create policy "Trip members can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.trips
      where trips.id = messages.trip_id
        and trips.organizer_id = auth.uid()
    ) or exists (
      select 1 from public.trip_participants
      where trip_participants.trip_id = messages.trip_id
        and trip_participants.user_id = auth.uid()
        and trip_participants.status = 'accepted'
    )
  );

create policy "Trip members can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and (
      exists (
        select 1 from public.trips
        where trips.id = messages.trip_id
          and trips.organizer_id = auth.uid()
      ) or exists (
        select 1 from public.trip_participants
        where trip_participants.trip_id = messages.trip_id
          and trip_participants.user_id = auth.uid()
          and trip_participants.status = 'accepted'
      )
    )
  );

-- POI Ratings
create table public.poi_ratings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  poi_id text not null, -- External ID from map provider or internal ID
  poi_name text not null,
  is_solo_friendly boolean default false,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.poi_ratings enable row level security;

create policy "POI ratings are viewable by everyone"
  on public.poi_ratings for select
  using (true);

create policy "Users can add ratings"
  on public.poi_ratings for insert
  with check (auth.uid() = user_id);

-- User Stats View (Mock for now, can be materialized view later)
create view public.user_stats as
select 
  p.id as user_id,
  count(distinct t.id) as trips_created,
  count(distinct tp.trip_id) as trips_joined,
  count(distinct pr.id) as contributions
from public.profiles p
left join public.trips t on t.organizer_id = p.id
left join public.trip_participants tp on tp.user_id = p.id
left join public.poi_ratings pr on pr.user_id = p.id
group by p.id;
