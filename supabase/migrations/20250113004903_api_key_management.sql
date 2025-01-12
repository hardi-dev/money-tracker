-- Create API keys table
create table public.api_keys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  key text unique not null,
  permissions text[] not null, -- ['transactions.create', 'transactions.delete']
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone,
  last_used_at timestamp with time zone,
  deleted_at timestamp with time zone,
  constraint api_keys_name_user_id_key unique nulls not distinct (name, user_id, deleted_at)
);

-- Create API key usage table
create table public.api_key_usage (
  id uuid default gen_random_uuid() primary key,
  api_key_id uuid references public.api_keys(id) on delete cascade not null,
  endpoint text not null,
  method text not null,
  status_code integer not null,
  ip_address text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index api_keys_user_id_idx on public.api_keys (user_id);
create index api_keys_key_idx on public.api_keys (key) where deleted_at is null;
create index api_key_usage_api_key_id_idx on public.api_key_usage (api_key_id);
create index api_key_usage_created_at_idx on public.api_key_usage (created_at);

-- Enable RLS
alter table api_keys enable row level security;
alter table api_key_usage enable row level security;

-- API keys policies
create policy "Users can view their own api keys"
  on public.api_keys for select using (auth.uid() = user_id);

create policy "Users can create their own api keys"
  on public.api_keys for insert with check (auth.uid() = user_id);

create policy "Users can update their own api keys"
  on public.api_keys for update using (auth.uid() = user_id);

create policy "Users can delete their own api keys"
  on public.api_keys for delete using (auth.uid() = user_id);

create policy "API can use valid keys"
  on public.api_keys for select using (deleted_at is null and (expires_at is null or expires_at > now()));

-- API key usage policies
create policy "Users can view their own api key usage"
  on public.api_key_usage for select using (
    exists (
      select 1 from api_keys
      where api_keys.id = api_key_usage.api_key_id
      and api_keys.user_id = auth.uid()
    )
  );

-- Update transaction policies for API access
create policy "API can create transactions with valid key"
  on public.transactions for insert with check (
    exists (
      select 1 from api_keys
      where api_keys.user_id = transactions.user_id
      and api_keys.deleted_at is null
      and (api_keys.expires_at is null or api_keys.expires_at > now())
      and 'transactions.create' = any(api_keys.permissions)
    )
  );

create policy "API can delete transactions with valid key"
  on public.transactions for delete using (
    exists (
      select 1 from api_keys
      where api_keys.user_id = transactions.user_id
      and api_keys.deleted_at is null
      and (api_keys.expires_at is null or api_keys.expires_at > now())
      and 'transactions.delete' = any(api_keys.permissions)
    )
  );

-- Add updated_at trigger for api_keys
create trigger handle_api_keys_updated_at
  before update on public.api_keys
  for each row
  execute function public.handle_updated_at();
