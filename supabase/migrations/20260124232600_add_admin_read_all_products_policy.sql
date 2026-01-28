/*
  # Add admin policy to read all products

  1. Changes
    - Add SELECT policy to allow reading all products (not just published ones)
    - This enables admin operations like edit and delete to work properly
    
  2. Security
    - Allows public read access to all products
    - Admin authentication is handled at application level
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Allow reading all products for admin'
  ) THEN
    CREATE POLICY "Allow reading all products for admin"
      ON products
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;