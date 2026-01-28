/*
  # Add SELECT policy for orders table

  1. Changes
    - Add policy to allow reading orders
  
  2. Security
    - Allows public to read orders (for order confirmation)
    - In production, you may want to restrict this to authenticated users only
*/

CREATE POLICY "Allow reading orders"
  ON orders FOR SELECT
  USING (true);
