-- =====================================================
-- Personal Digital Vault
-- Database Schema
-- Supabase PostgreSQL
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =====================================================
-- PROFILES
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT profiles_role_check
        CHECK (role IN ('user', 'admin'))
);


-- =====================================================
-- FOLDERS
-- =====================================================

CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    user_id TEXT NOT NULL,

    name TEXT NOT NULL,

    parent_folder_id UUID,

    CONSTRAINT folders_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT folders_parent_folder_id_fkey
        FOREIGN KEY (parent_folder_id)
        REFERENCES folders(id)
        ON DELETE CASCADE
);


-- =====================================================
-- FILES
-- =====================================================

CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id TEXT NOT NULL,

    folder_id UUID,

    file_name TEXT NOT NULL,

    storage_path TEXT NOT NULL,

    file_size INTEGER,

    uploaded_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT files_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT files_folder_id_fkey
        FOREIGN KEY (folder_id)
        REFERENCES folders(id)
        ON DELETE CASCADE
);


-- =====================================================
-- CREDENTIALS
-- =====================================================

CREATE TABLE IF NOT EXISTS credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    user_id TEXT NOT NULL,

    title TEXT NOT NULL,

    secret_value TEXT NOT NULL,

    CONSTRAINT credentials_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE
);


-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_folders_user_id
ON folders(user_id);

CREATE INDEX IF NOT EXISTS idx_folders_parent_folder_id
ON folders(parent_folder_id);

CREATE INDEX IF NOT EXISTS idx_files_user_id
ON files(user_id);

CREATE INDEX IF NOT EXISTS idx_files_folder_id
ON files(folder_id);

CREATE INDEX IF NOT EXISTS idx_files_file_name
ON files(file_name);

CREATE INDEX IF NOT EXISTS idx_credentials_user_id
ON credentials(user_id);