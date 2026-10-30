-- รันใน Supabase: SQL Editor > New query > วาง > Run

create table if not exists public.days (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day text not null,                       -- รูปแบบ YYYY-MM-DD
  entries jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.settings (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  accounts jsonb not null default '[]'::jsonb
);

alter table public.days enable row level security;
alter table public.settings enable row level security;

-- แต่ละคนเห็นและแก้ได้เฉพาะแถวของตัวเอง
drop policy if exists "own days" on public.days;
create policy "own days" on public.days
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "own settings" on public.settings;
create policy "own settings" on public.settings
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
