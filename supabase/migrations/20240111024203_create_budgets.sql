-- Create budgets table
create table if not exists public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete restrict not null,
  amount numeric(15,2) not null check (amount > 0),
  start_date date not null,
  end_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted_at timestamp with time zone,
  constraint budgets_date_range_check check (end_date >= start_date),
  constraint budgets_category_date_unique unique nulls not distinct (category_id, start_date, end_date, deleted_at)
);

-- Enable RLS
alter table public.budgets enable row level security;

-- Create budgets policies
create policy "Users can view their own budgets" on public.budgets
  for select using (
    auth.uid() = user_id
    and deleted_at is null
  );

create policy "Users can create their own budgets" on public.budgets
  for insert with check (
    auth.uid() = user_id
  );

create policy "Users can update their own budgets" on public.budgets
  for update using (
    auth.uid() = user_id
    and deleted_at is null
  );

create policy "Users can delete their own budgets" on public.budgets
  for delete using (
    auth.uid() = user_id
    and deleted_at is null
  );

-- Create indexes
create index if not exists budgets_user_id_idx on public.budgets (user_id);
create index if not exists budgets_category_id_idx on public.budgets (category_id);
create index if not exists budgets_date_range_idx on public.budgets (start_date, end_date);
create index if not exists budgets_deleted_at_idx on public.budgets (deleted_at);

-- Set up Row Level Security
alter table public.budgets force row level security;

-- Create updated_at trigger
create trigger handle_budgets_updated_at
  before update on public.budgets
  for each row execute procedure public.handle_updated_at();
