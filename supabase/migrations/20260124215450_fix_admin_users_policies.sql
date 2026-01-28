-- Fix admin_users table policies to allow login

-- Drop existing restrictive setup
DROP POLICY IF EXISTS "Allow admin login" ON admin_users;

-- Create policy to allow reading admin_users for authentication
CREATE POLICY "Allow admin login"
  ON admin_users FOR SELECT
  USING (true);
