-- Drop existing policies
drop policy if exists "Users can create their own transactions" on public.transactions;

-- Create updated policy for transactions
create policy "Users can create their own transactions" on public.transactions
  for insert with check (
    -- Allow if authenticated user matches
    auth.uid() = user_id
    -- Or if the user_id exists in api_keys with matching permissions
    or exists (
      select 1 
      from public.api_keys 
      where key = current_setting('request.headers')::json->>'x-api-key'
      and user_id = transactions.user_id
      and 'transactions.create' = any(permissions)
      and deleted_at is null
      and (expires_at is null or expires_at > now())
    )
  );
