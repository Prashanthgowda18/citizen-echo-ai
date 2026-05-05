alter table public.submissions
  add column if not exists photos jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public)
values ('submission-photos', 'submission-photos', true)
on conflict (id) do nothing;

create policy if not exists "Allow public read submission photos"
  on storage.objects for select
  using (bucket_id = 'submission-photos');

create policy if not exists "Allow public upload submission photos"
  on storage.objects for insert
  with check (bucket_id = 'submission-photos');
