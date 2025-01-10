-- Create transactions table
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete restrict not null,
  amount numeric(15,2) not null check (amount > 0),
  type public.category_type not null,
  description text,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted_at timestamp with time zone
);

-- Enable RLS
alter table public.transactions enable row level security;

-- Create transactions policies
create policy "Users can view their own transactions" on public.transactions
  for select using (
    auth.uid() = user_id
    and deleted_at is null
  );

create policy "Users can create their own transactions" on public.transactions
  for insert with check (
    auth.uid() = user_id
  );

create policy "Users can update their own transactions" on public.transactions
  for update using (
    auth.uid() = user_id
    and deleted_at is null
  );

create policy "Users can delete their own transactions" on public.transactions
  for delete using (
    auth.uid() = user_id
    and deleted_at is null
  );

-- Create indexes
create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_category_id_idx on public.transactions (category_id);
create index if not exists transactions_date_idx on public.transactions (date);
create index if not exists transactions_type_idx on public.transactions (type);
create index if not exists transactions_deleted_at_idx on public.transactions (deleted_at);

-- Set up Row Level Security
alter table public.transactions force row level security;

-- Create updated_at trigger
create trigger handle_transactions_updated_at
  before update on public.transactions
  for each row execute procedure public.handle_updated_at();
