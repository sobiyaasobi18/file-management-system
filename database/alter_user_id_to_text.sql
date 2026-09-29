-- =====================================================
-- Personal Digital Vault
-- Migration: Change User IDs from UUID to TEXT
-- =====================================================

-- Clerk user IDs are strings, for example:
-- user_2abc123...
--
-- Therefore profiles.id and all related user_id
-- columns need to use TEXT instead of UUID.


-- =====================================================
-- 1. DROP EXISTING FOREIGN KEY CONSTRAINTS
-- =====================================================

ALTER TABLE folders
DROP CONSTRAINT IF EXISTS folders_user_id_fkey;

ALTER TABLE files
DROP CONSTRAINT IF EXISTS files_user_id_fkey;

ALTER TABLE credentials
DROP CONSTRAINT IF EXISTS credentials_user_id_fkey;


-- =====================================================
-- 2. CHANGE profiles.id FROM UUID TO TEXT
-- =====================================================

ALTER TABLE profiles
ALTER COLUMN id TYPE TEXT
USING id::TEXT;


-- =====================================================
-- 3. CHANGE folders.user_id FROM UUID TO TEXT
-- =====================================================

ALTER TABLE folders
ALTER COLUMN user_id TYPE TEXT
USING user_id::TEXT;


-- =====================================================
-- 4. CHANGE files.user_id FROM UUID TO TEXT
-- =====================================================

ALTER TABLE files
ALTER COLUMN user_id TYPE TEXT
USING user_id::TEXT;


-- =====================================================
-- 5. CHANGE credentials.user_id FROM UUID TO TEXT
-- =====================================================

ALTER TABLE credentials
ALTER COLUMN user_id TYPE TEXT
USING user_id::TEXT;


-- =====================================================
-- 6. RECREATE FOREIGN KEY - folders
-- =====================================================

ALTER TABLE folders
ADD CONSTRAINT folders_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;


-- =====================================================
-- 7. RECREATE FOREIGN KEY - files
-- =====================================================

ALTER TABLE files
ADD CONSTRAINT files_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;


-- =====================================================
-- 8. RECREATE FOREIGN KEY - credentials
-- =====================================================

ALTER TABLE credentials
ADD CONSTRAINT credentials_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;


-- =====================================================
-- MIGRATION RESULT
-- =====================================================

-- profiles.id          -> TEXT
-- folders.user_id      -> TEXT
-- files.user_id        -> TEXT
-- credentials.user_id  -> TEXT
--
-- These columns can now store Clerk user IDs.