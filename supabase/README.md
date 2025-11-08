# Supabase Setup Guide

This directory contains the Supabase database schema, migrations, and configuration for VibeBoard.

## Prerequisites

1. **Supabase Account**: Sign up at [https://supabase.com](https://supabase.com)
2. **Supabase CLI** (optional, for local development): `npm install -g supabase`

## Quick Setup

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: `vibeboard`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click "Create new project"

### 2. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: Your public API key
   - **service_role key**: Your service role key (keep secret!)

### 3. Configure Environment Variables

#### Web App (`packages/web/.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Mobile App (`packages/mobile/.env`)

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Database Migrations

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `migrations/20250108000000_init_schema.sql`
3. Paste into the SQL Editor
4. Click "Run"

#### Option B: Using Supabase CLI

```bash
# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 5. Verify Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `profiles`
   - `favorites`
   - `purchases`
   - `analytics`

## Database Schema

### Tables

#### `profiles`

- Extends `auth.users` with additional profile information
- Auto-created when a user signs up
- Fields: `id`, `username`, `full_name`, `avatar_url`, timestamps

#### `favorites`

- Stores user-favorited text styles
- Unique constraint on (user_id, style_id, pack_id)
- Fields: `id`, `user_id`, `style_id`, `pack_id`, `created_at`

#### `purchases`

- Tracks user subscriptions and pack purchases
- Fields: `id`, `user_id`, `product_id`, `product_type`, `status`, timestamps

#### `analytics`

- Logs app events for analytics
- Anonymous events allowed (user_id can be null)
- Fields: `id`, `user_id`, `event_name`, `event_data`, `created_at`

## Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:

- Users can only access their own data
- Public profile information is viewable by everyone
- Analytics events can be inserted anonymously

## Local Development (Optional)

### Start Supabase Locally

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db push

# Open Studio
open http://localhost:54323
```

### Reset Database

```bash
supabase db reset
```

## Testing

### Test Authentication

```bash
# Sign up a test user via web app
# Check profiles table to verify auto-creation

# Or use Supabase dashboard:
# Authentication → Users → Add User
```

### Test Favorites Sync

1. Sign in to the app
2. Add some favorites
3. Check the `favorites` table in Supabase
4. Sign in on another device - favorites should sync

## Troubleshooting

### "Invalid API key" error

- Verify your `.env.local` file has the correct keys
- Restart your development server after adding env vars

### RLS policy errors

- Check that policies are enabled in Table Editor → [table] → Policies
- Ensure user is authenticated when accessing protected data

### Migration errors

- Run migrations in order (by timestamp in filename)
- Check SQL Editor for detailed error messages

## Next Steps

After completing setup:

1. Test authentication flows (Story 5.3)
2. Implement cloud favorites sync (Story 5.4)
3. Add analytics tracking (Story 5.5)
