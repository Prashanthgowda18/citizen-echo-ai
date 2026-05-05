-- Hackverse 2026 schema for GovSense app
-- Run with: supabase db push

create table if not exists public.submissions (
  id text primary key,
  text text not null,
  domain text not null,
  coreIssue text not null,
  location text not null,
  urgency text not null,
  sentiment double precision not null,
  emotionalIntensity double precision not null,
  type text not null,
  keywords jsonb not null,
  date text not null,
  language text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.policy_briefs (
  id text primary key,
  title text not null,
  domain text not null,
  status text not null,
  priorityScore integer not null,
  submissionCount integer not null,
  trend text not null,
  executiveSummary text not null,
  affectedCitizens integer not null,
  geographicDistribution jsonb not null,
  sentimentTimeline jsonb not null,
  citizenQuotes jsonb not null,
  rootCause text not null,
  recommendations jsonb not null,
  createdAt text not null,
  updatedAt text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id text primary key,
  type text not null,
  message text not null,
  timestamp text not null,
  domain text,
  created_at timestamptz not null default now()
);

alter table public.submissions enable row level security;
alter table public.policy_briefs enable row level security;
alter table public.activities enable row level security;

create policy if not exists "Allow read access submissions"
  on public.submissions for select
  using (true);

create policy if not exists "Allow insert access submissions"
  on public.submissions for insert
  with check (true);

create policy if not exists "Allow update access submissions"
  on public.submissions for update
  using (true)
  with check (true);

create policy if not exists "Allow read access policy_briefs"
  on public.policy_briefs for select
  using (true);

create policy if not exists "Allow insert access policy_briefs"
  on public.policy_briefs for insert
  with check (true);

create policy if not exists "Allow update access policy_briefs"
  on public.policy_briefs for update
  using (true)
  with check (true);

create policy if not exists "Allow read access activities"
  on public.activities for select
  using (true);

create policy if not exists "Allow insert access activities"
  on public.activities for insert
  with check (true);

create policy if not exists "Allow update access activities"
  on public.activities for update
  using (true)
  with check (true);
