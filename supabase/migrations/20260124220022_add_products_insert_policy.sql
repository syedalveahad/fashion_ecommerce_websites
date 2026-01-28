/*
  # Add INSERT policy for products table

  1. Changes
    - Add policy to allow inserting products (for admin operations)
    - Add policy to allow updating products (for admin operations)
    - Add policy to allow deleting products (for admin operations)
  
  2. Security
    - Uses USING (true) to allow all inserts/updates/deletes
    - In production, you should restrict this to authenticated admin users
*/

-- Allow inserting products
CREATE POLICY "Allow product insert"
  ON products FOR INSERT
  WITH CHECK (true);

-- Allow updating products
CREATE POLICY "Allow product update"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow deleting products
CREATE POLICY "Allow product delete"
  ON products FOR DELETE
  USING (true);
