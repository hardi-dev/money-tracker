-- Create category types enum
create type public.category_type as enum ('INCOME', 'EXPENSE');

-- Create categories table
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type public.category_type not null,
  color text not null,
  icon text,
  description text,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted_at timestamp with time zone,
  constraint categories_name_user_id_type_key unique nulls not distinct (name, user_id, type, deleted_at)
);

-- Enable RLS
alter table public.categories enable row level security;

-- Create categories policies
create policy "Users can view their own categories" on public.categories
  for select using (
    auth.uid() = user_id
    and deleted_at is null
  );

create policy "Users can create their own categories" on public.categories
  for insert with check (
    auth.uid() = user_id
  );

create policy "Users can update their own categories" on public.categories
  for update using (
    auth.uid() = user_id
    and deleted_at is null
  );

create policy "Users can delete their own categories" on public.categories
  for delete using (
    auth.uid() = user_id
    and deleted_at is null
  );

-- Create indexes
create index if not exists categories_user_id_idx on public.categories (user_id);
create index if not exists categories_type_idx on public.categories (type);
create index if not exists categories_deleted_at_idx on public.categories (deleted_at);

-- Set up Row Level Security
alter table public.categories force row level security;

-- Create updated_at trigger
create trigger handle_categories_updated_at
  before update on public.categories
  for each row execute procedure public.handle_updated_at();

-- Create function to insert default categories for new users
create or replace function public.handle_new_user_categories()
returns trigger as $$
begin
  insert into public.categories (name, type, color, icon, is_default, user_id)
  values 
    ('Salary', 'INCOME', '#00A5A5', 'wallet', true, new.id),
    ('Investment', 'INCOME', '#4CAF50', 'trending-up', true, new.id),
    ('Food & Drinks', 'EXPENSE', '#FF5722', 'utensils', true, new.id),
    ('Transportation', 'EXPENSE', '#2196F3', 'car', true, new.id),
    ('Shopping', 'EXPENSE', '#9C27B0', 'shopping-bag', true, new.id),
    ('Entertainment', 'EXPENSE', '#FFC107', 'film', true, new.id),
    ('Bills', 'EXPENSE', '#F44336', 'file-text', true, new.id),
    ('Others', 'EXPENSE', '#607D8B', 'more-horizontal', true, new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to add default categories for new users
create trigger on_auth_user_created_add_categories
  after insert on public.profiles
  for each row execute procedure public.handle_new_user_categories();
