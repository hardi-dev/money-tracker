-- Enable request.jwt() for RLS policies
create or replace function requesting_user_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select 
    case
      -- If using API key, get user_id from api_keys table
      when current_setting('request.headers', true)::json->>'x-api-key' is not null then
        (
          select user_id
          from api_keys
          where key = current_setting('request.headers', true)::json->>'x-api-key'
          and deleted_at is null
          and (expires_at is null or expires_at > now())
          limit 1
        )
      -- Otherwise use authenticated user
      else auth.uid()
    end
$$;

-- Drop existing policies
drop policy if exists "Users can create their own transactions" on public.transactions;
drop policy if exists "Users can view their own transactions" on public.transactions;
drop policy if exists "Users can update their own transactions" on public.transactions;
drop policy if exists "Users can delete their own transactions" on public.transactions;

-- Create updated policies
create policy "Enable read access to own transactions"
  on public.transactions
  for select using (
    user_id = requesting_user_id()
    and deleted_at is null
  );

create policy "Enable insert access to own transactions"
  on public.transactions
  for insert with check (
    user_id = requesting_user_id()
  );

create policy "Enable update access to own transactions"
  on public.transactions
  for update using (
    user_id = requesting_user_id()
    and deleted_at is null
  );

create policy "Enable delete access to own transactions"
  on public.transactions
  for delete using (
    user_id = requesting_user_id()
    and deleted_at is null
  );
