# Personal Digital Vault - Database

## Overview

The Personal Digital Vault uses Supabase PostgreSQL
for database storage and Supabase Storage for private
document storage.

Authentication is handled using Clerk.

The backend is built using Node.js and Express.


## Database Tables

The project contains four main tables:

### 1. profiles

Stores user profile information.

Fields include:

- id
- created_at
- full_name
- email
- role

The `id` field uses TEXT because Clerk user IDs are
string values such as `user_2abc...`.

Supported roles:

- user
- admin

The default role is `user`.


### 2. folders

Stores folders created by users.

Fields include:

- id
- created_at
- user_id
- name
- parent_folder_id

`parent_folder_id` allows nested folders.


### 3. files

Stores metadata for uploaded documents.

Fields include:

- id
- user_id
- folder_id
- file_name
- storage_path
- file_size
- uploaded_at

The actual document is stored in Supabase Storage.


### 4. credentials

Stores private credential records.

Fields include:

- id
- created_at
- user_id
- title
- secret_value

The backend should encrypt `secret_value` before
storing sensitive credential information.


## Supabase Storage

Storage bucket name:

`documents`

Bucket access:

`Private`

Uploaded files are stored in this bucket.

The `files.storage_path` field stores the location
of each uploaded document.


## Authentication

Authentication is handled by Clerk.

After authentication, the frontend sends the Clerk
token to the Express backend.

The backend verifies the token and obtains the
authenticated user ID through:

`req.userId`

Clerk user IDs are stored as TEXT in the database.


## Security

Row Level Security (RLS) is enabled for:

- profiles
- folders
- files
- credentials

The React frontend does not use the Supabase
service role key.

The Node.js / Express backend uses the service role
key for server-side database operations.

The backend is responsible for checking that users
can access only their own folders, files and
credentials.


## Admin and User Roles

### User

A normal user can:

- Manage their profile
- Create folders
- Upload files
- Download their own files
- Delete their own files
- Store credentials
- Search their files


### Admin

An administrator can:

- View system-level statistics
- View user account information
- View total users
- View total file counts
- View storage usage
- Monitor system activity

Administrators should not access users' private
document contents or credential secret values.


## Environment Variables

Secret environment variables must be stored in
`.env`.

Do not commit `.env` to GitHub.

Examples of sensitive values:

- Supabase service role key
- Clerk secret key
- Database credentials


## Database Files

`schema.sql`

Contains the database table definitions,
relationships and indexes.

`rls_policies.sql`

Documents the Row Level Security configuration.

`alter_user_id_to_text.sql`

Documents the migration from UUID user IDs to
TEXT Clerk user IDs.

`README.md`

Contains database setup and architecture
documentation.