-- Function to allow a user to delete their own account
-- Runs as SECURITY DEFINER so it has permission to delete from auth.users
create or replace function public.delete_user()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

-- Only authenticated users can call this
revoke execute on function public.delete_user() from anon;
grant execute on function public.delete_user() to authenticated;
