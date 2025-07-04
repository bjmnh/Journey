/*
  # Create users and character sheets tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `character_sheets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `context` (text)
      - `academics` (text)
      - `familial_notes` (text)
      - `social_notes` (text)
      - `passion_notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `tropes`
      - `id` (uuid, primary key)
      - `character_sheet_id` (uuid, foreign key to character_sheets)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Character sheets table
CREATE TABLE IF NOT EXISTS character_sheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  context text DEFAULT '',
  academics text DEFAULT '',
  familial_notes text DEFAULT '',
  social_notes text DEFAULT '',
  passion_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tropes table
CREATE TABLE IF NOT EXISTS tropes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_sheet_id uuid NOT NULL REFERENCES character_sheets(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tropes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for character_sheets
CREATE POLICY "Users can read own character sheets"
  ON character_sheets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own character sheets"
  ON character_sheets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own character sheets"
  ON character_sheets
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for tropes
CREATE POLICY "Users can read own tropes"
  ON tropes
  FOR SELECT
  TO authenticated
  USING (
    character_sheet_id IN (
      SELECT id FROM character_sheets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own tropes"
  ON tropes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    character_sheet_id IN (
      SELECT id FROM character_sheets WHERE user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_sheets_updated_at
  BEFORE UPDATE ON character_sheets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();