# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub/Google
4. Click "New Project"
5. Choose organization and enter:
   - **Name**: `prism-app`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project" (takes ~2 minutes)

## Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values to your `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire content from `supabase-schema.sql`
4. Click "Run" to execute

## Step 4: Enable Authentication

1. Go to **Authentication** → **Settings**
2. Under **Auth Providers**, enable:
   - ✅ Email (already enabled)
   - ✅ Phone (optional)
3. Under **Email Templates**, customize if needed
4. **Site URL**: Set to `http://localhost:3000` for development

## Step 5: Storage Setup (for images)

1. Go to **Storage**
2. Click "Create bucket"
3. Name: `clothing-images`
4. Make it **Public** (for easy image access)
5. Click "Create bucket"

## Step 6: Test Connection

Run your app with `npm run dev` and try creating an account!

## Troubleshooting

- **CORS errors**: Add your domain to **Settings** → **API** → **CORS**
- **Auth issues**: Check **Authentication** → **Users** for created accounts
- **Database errors**: Check **Database** → **Logs** for SQL errors