-- ==========================================================================
-- Ikram Jewellers - Supabase PostgreSQL Database Schema
-- ==========================================================================

-- 1. CLEANUP EXPORTED OBJECTS
drop policy if exists "Allow public read access to products" on public.products;
drop policy if exists "Allow admin write access to products" on public.products;
drop policy if exists "Allow public read access to settings" on public.settings;
drop policy if exists "Allow admin write access to settings" on public.settings;
drop policy if exists "Allow select own user" on public.users;
drop policy if exists "Allow admin all access to users" on public.users;

drop table if exists public.products;
drop table if exists public.settings;
drop table if exists public.users;

-- 2. CREATE PRODUCTS TABLE
create table public.products (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    "referenceCode" text,
    "basePrice" numeric default 0,
    "estimatedWeight" text,
    "metalPurity" text,
    category text,
    description text,
    listed boolean default true,
    "imageUrl" text,
    "createdAt" timestamptz default now(),
    "updatedAt" timestamptz default now()
);

-- 3. CREATE SITE SETTINGS TABLE
create table public.settings (
    key text primary key,
    "websiteName" text default 'IKRAM JEWELLERS',
    "logoUrl" text,
    "brandIconUrl" text,
    "updatedAt" timestamptz default now()
);

-- 4. CREATE USERS ROLE/RBAC TABLE
create table public.users (
    id uuid references auth.users on delete cascade primary key,
    "isAdmin" boolean default false,
    "createdAt" timestamptz default now()
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.products enable row level security;
alter table public.settings enable row level security;
alter table public.users enable row level security;

-- 6. CONFIGURE RLS SECURITY POLICIES

-- Products Policies
create policy "Allow public read access to products"
on public.products for select
using (true);

create policy "Allow admin write access to products"
on public.products for all
using (
    exists (
        select 1 from public.users
        where id = auth.uid() and "isAdmin" = true
    )
);

-- Settings Policies
create policy "Allow public read access to settings"
on public.settings for select
using (true);

create policy "Allow admin write access to settings"
on public.settings for all
using (
    exists (
        select 1 from public.users
        where id = auth.uid() and "isAdmin" = true
    )
);

-- Users RBAC Policies
create policy "Allow select own user"
on public.users for select
using (auth.uid() = id);

create policy "Allow admin all access to users"
on public.users for all
using (
    exists (
        select 1 from public.users
        where id = auth.uid() and "isAdmin" = true
    )
);

-- 7. DEFAULT WEBSITE SETTINGS SEED RECORD
insert into public.settings (key, "websiteName")
values ('site', 'IKRAM JEWELLERS')
on conflict (key) do nothing;
