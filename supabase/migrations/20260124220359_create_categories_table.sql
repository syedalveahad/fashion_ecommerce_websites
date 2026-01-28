/*
  # Create categories table

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Category name
      - `slug` (text, unique) - URL-friendly version
      - `image_url` (text) - Category image URL
      - `description` (text) - Optional description
      - `display_order` (integer) - For sorting categories
      - `is_active` (boolean) - Show/hide category
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `categories` table
    - Add policy for public to read active categories
    - Add policies for all CRUD operations (for admin use)
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text NOT NULL,
  description text DEFAULT '',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public can read active categories
CREATE POLICY "Public can read active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- Allow all operations (for admin functionality)
CREATE POLICY "Allow category insert"
  ON categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow category update"
  ON categories FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow category delete"
  ON categories FOR DELETE
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
