-- Enable UUID + extensions if needed
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 email text unique,
 is_admin boolean default false,
 created_at timestamp with time zone default now()
);

-- Saves (per-user slots)
create table if not exists saves (
 id uuid primary key default uuid_generate_v4(),
 user_id uuid not null references auth.users(id) on delete cascade,
 slot int not null default 1,
 data jsonb not null,
 updated_at timestamp with time zone default now(),
 unique(user_id, slot)
);

-- NPCs (admin-managed)
create table if not exists npcs (
 id serial primary key,
 slug text unique not null,
 name text not null,
 dialogue jsonb not null default '{"lines":[]}'::jsonb,
 pos jsonb not null default '{"x":0,"y":0}'::jsonb,
 active boolean not null default true
);

-- World flags (admin-managed key/value)
create table if not exists world_flags (
 key text primary key,
 value jsonb not null default '{}'::jsonb,
 updated_at timestamp with time zone default now()
);

-- RLS
alter table profiles enable row level security;
alter table saves enable row level security;
alter table npcs enable row level security;
alter table world_flags enable row level security;

-- Policies: profiles (user can read self)
create policy "read own profile" on profiles for select using (auth.uid() = id);

-- Policies: saves (user can read/write own saves)
create policy "select own saves" on saves for select using (auth.uid() = user_id);

create policy "upsert own saves" on saves for insert with check (auth.uid() = user_id);
create policy "update own saves" on saves for update using (auth.uid() = user_id);

-- Policies: npcs/world_flags (read all; write admin)
create policy "read npcs" on npcs for select using (true);
create policy "read flags" on world_flags for select using (true);

-- Admin helpers: only users with is_admin OR role=admin can write
create or replace function is_admin() returns boolean language sql stable as $$
 select coalesce( (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );
$$;

create policy "admin write npcs" on npcs
for all using (is_admin()) with check (is_admin());

create policy "admin write flags" on world_flags
for all using (is_admin()) with check (is_admin());

-- Upsert profile on signup (optional trigger)
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
 insert into profiles (id, email, is_admin) values (new.id, new.email, false)
 on conflict (id) do nothing; return new; end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure handle_new_user();
