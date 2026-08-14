-- AeroPulse: historical signal snapshots
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query).

create table if not exists signal_snapshots (
  id bigint generated always as identity primary key,
  airport_iata text not null,
  captured_at timestamptz not null default now(),
  rain_chance smallint not null,
  wind_speed numeric not null,
  visibility text not null,
  temperature numeric not null,
  observed_aircraft integer not null,
  score smallint not null,
  status text not null
);

create index if not exists signal_snapshots_iata_time_idx
  on signal_snapshots (airport_iata, captured_at desc);

alter table signal_snapshots enable row level security;

-- Anyone can read history (it's shown publicly on the site).
create policy "Public read access"
  on signal_snapshots for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policy for anon/authenticated on purpose:
-- only the service_role key (used by the scheduled GitHub Action, never
-- shipped to the browser) can write rows.
