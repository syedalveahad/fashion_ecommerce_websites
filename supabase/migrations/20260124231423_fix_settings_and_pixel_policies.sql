/*
  # Fix Settings and Facebook Pixel RLS Policies

  1. Changes
    - Add INSERT policy for settings table to allow admin updates
    - Add UPDATE policy for settings table to allow admin updates
    - Add INSERT policy for fb_pixel_settings table to allow admin updates
    - Add UPDATE policy for fb_pixel_settings table to allow admin updates
    
  2. Security
    - All insert/update policies allow public access since admin authentication is handled at application level
    - Existing SELECT policies remain unchanged for public read access
*/

-- Settings table policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'settings' AND policyname = 'Allow settings insert'
  ) THEN
    CREATE POLICY "Allow settings insert"
      ON settings
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'settings' AND policyname = 'Allow settings update'
  ) THEN
    CREATE POLICY "Allow settings update"
      ON settings
      FOR UPDATE
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Facebook Pixel settings policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fb_pixel_settings' AND policyname = 'Allow fb pixel settings insert'
  ) THEN
    CREATE POLICY "Allow fb pixel settings insert"
      ON fb_pixel_settings
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'fb_pixel_settings' AND policyname = 'Allow fb pixel settings update'
  ) THEN
    CREATE POLICY "Allow fb pixel settings update"
      ON fb_pixel_settings
      FOR UPDATE
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;