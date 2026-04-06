-- ─────────────────────────────────────────────────────────────────────────────
-- VOXE — Supabase Schema
-- Run this in: supabase.com → Your Project → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with extra fields
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  phone       text,
  role        text not null default 'customer', -- 'customer' | 'admin'
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── PRODUCTS ────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  description   text,
  price         integer not null,           -- in kobo (₦89,500 = 8950000)
  discount_price integer,
  gender        text not null check (gender in ('men','women','teens','kids')),
  type          text not null check (type in ('clothing','footwear')),
  subtype       text not null,
  colors        text[] not null default '{}',
  sizes         text[] not null default '{}',
  images        text[] not null default '{}',
  tag           text check (tag in ('New','Bestseller','Limited')),
  sku           text unique,
  stock         integer not null default 0,
  status        text not null default 'active' check (status in ('active','draft')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── ORDERS ──────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default uuid_generate_v4(),
  order_number    text unique not null,      -- e.g. VXE-A1B2C3 (tracking ID)
  user_id         uuid references auth.users(id) on delete set null,
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text,
  address         text not null,
  state           text not null,
  lga             text not null,
  subtotal        integer not null,          -- kobo
  shipping        integer not null default 350000,
  discount        integer not null default 0,
  total           integer not null,
  payment_method  text not null check (payment_method in ('card','transfer','pod')),
  payment_status  text not null default 'pending' check (payment_status in ('pending','paid','failed')),
  delivery_status text not null default 'pending' check (delivery_status in ('pending','processing','shipped','delivered','cancelled')),
  tracking_note   text,
  promo_code      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── ORDER ITEMS ─────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid references public.orders(id) on delete cascade not null,
  product_id  uuid references public.products(id) on delete set null,
  name        text not null,
  price       integer not null,             -- kobo, price at time of purchase
  quantity    integer not null default 1,
  size        text not null,
  color       text not null,
  image_url   text
);

-- ─── DROPS ───────────────────────────────────────────────────────────────────
create table if not exists public.drops (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  start_date    timestamptz not null,
  end_date      timestamptz not null,
  limited_qty   integer not null default 30,
  status        text not null default 'scheduled' check (status in ('active','scheduled','ended')),
  created_at    timestamptz not null default now()
);

create table if not exists public.drop_products (
  drop_id     uuid references public.drops(id) on delete cascade,
  product_id  uuid references public.products(id) on delete cascade,
  primary key (drop_id, product_id)
);

-- ─── WISHLIST ────────────────────────────────────────────────────────────────
create table if not exists public.wishlists (
  user_id     uuid references auth.users(id) on delete cascade,
  product_id  uuid references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ─── PROMO CODES ─────────────────────────────────────────────────────────────
create table if not exists public.promo_codes (
  id          uuid primary key default uuid_generate_v4(),
  code        text unique not null,
  rate        numeric(4,2) not null,         -- e.g. 0.10 = 10%
  active      boolean not null default true,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

-- Seed default promo codes
insert into public.promo_codes (code, rate) values
  ('VOXE10',  0.10),
  ('VOXE20',  0.20),
  ('WELCOME', 0.15)
on conflict (code) do nothing;

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────

alter table public.profiles    enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.drops       enable row level security;
alter table public.drop_products enable row level security;
alter table public.wishlists   enable row level security;
alter table public.promo_codes enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Products: anyone can read active products
create policy "Anyone can view active products"
  on public.products for select using (status = 'active');
-- Admins can do everything (checked via profiles.role)
create policy "Admins can manage products"
  on public.products for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Orders: users can view their own orders
create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders"
  on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins can manage all orders"
  on public.orders for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Order items: follow order access
create policy "Users can view own order items"
  on public.order_items for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );
create policy "Admins can manage order items"
  on public.order_items for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Drops: anyone can read active/scheduled drops
create policy "Anyone can view drops"
  on public.drops for select using (true);
create policy "Admins can manage drops"
  on public.drops for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Anyone can view drop products"
  on public.drop_products for select using (true);
create policy "Admins can manage drop products"
  on public.drop_products for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Wishlist: users manage their own
create policy "Users can manage own wishlist"
  on public.wishlists for all using (auth.uid() = user_id);

-- Promo codes: anyone can read active ones
create policy "Anyone can read active promo codes"
  on public.promo_codes for select using (active = true);
create policy "Admins can manage promo codes"
  on public.promo_codes for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_products_updated_at before update on public.products
  for each row execute procedure public.set_updated_at();
create trigger set_orders_updated_at before update on public.orders
  for each row execute procedure public.set_updated_at();
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
