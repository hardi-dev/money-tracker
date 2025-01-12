-- Drop existing policies
drop policy if exists "Users can view their own categories" on public.categories;
drop policy if exists "Users can create their own categories" on public.categories;
drop policy if exists "Users can update their own categories" on public.categories;
drop policy if exists "Users can delete their own categories" on public.categories;

-- Create updated policies using requesting_user_id() function
create policy "Enable read access to own categories"
  on public.categories
  for select using (
    user_id = requesting_user_id()
    and deleted_at is null
  );

create policy "Enable insert access to own categories"
  on public.categories
  for insert with check (
    user_id = requesting_user_id()
  );

create policy "Enable update access to own categories"
  on public.categories
  for update using (
    user_id = requesting_user_id()
    and deleted_at is null
  );

create policy "Enable delete access to own categories"
  on public.categories
  for delete using (
    user_id = requesting_user_id()
    and deleted_at is null
  );
