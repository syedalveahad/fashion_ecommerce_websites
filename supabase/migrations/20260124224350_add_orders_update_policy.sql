/*
  # Add UPDATE policy for orders table

  1. Changes
    - Add policy to allow updating orders
  
  2. Security
    - Allows public to update orders (for admin panel functionality)
    - In production, you should restrict this to authenticated admin users only
*/

CREATE POLICY "Allow updating orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);
