# 🔐 Bookshelf App with Supabase Authentication

This version includes user authentication and cloud database storage. Each user has their own private bookshelf!

## 🎯 What's New

- ✅ **User Authentication** - Login/Signup with email and password
- ✅ **Private Bookshelves** - Each user sees only their own books
- ✅ **Cloud Storage** - Books stored in Supabase (PostgreSQL)
- ✅ **Real-time Sync** - Changes sync across devices instantly
- ✅ **Secure** - Row-level security ensures data privacy

---

## 📋 Setup Instructions

### Step 1: Get Your Supabase Anon Key

1. Go to your Supabase project: https://supabase.com/dashboard/project/gscxdcsyrymcrntbpcvq
2. Click **Project Settings** (gear icon in sidebar)
3. Click **API** in the left menu
4. Copy the **anon public** key (long string starting with `eyJ...`)

### Step 2: Create Environment File

1. In your project folder, create a file called `.env` (note the dot at the start)
2. Add these two lines:

```
VITE_SUPABASE_URL=https://gscxdcsyrymcrntbpcvq.supabase.co
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

3. Replace `paste_your_anon_key_here` with the key you copied in Step 1
4. Save the file

**Important:** The `.env` file should be in the same folder as `package.json`

### Step 3: Set Up the Database

1. Go to your Supabase project
2. Click **SQL Editor** in the left sidebar
3. Click **+ New Query**
4. Copy and paste this SQL code:

```sql
-- Create books table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('want_to_read', 'currently_reading', 'read')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Users can only see their own books
CREATE POLICY "Users can view their own books"
  ON books FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books"
  ON books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
  ON books FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
  ON books FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX books_user_id_idx ON books(user_id);
CREATE INDEX books_status_idx ON books(status);

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Run the App

```bash
npm run dev
```

### Step 6: Open in Browser

Go to: http://localhost:5173

You should see a login/signup page!

---

## 🎉 Using the App

### First Time Users

1. **Sign Up**
   - Click "Don't have an account? Sign up"
   - Enter your email and password (min 6 characters)
   - Click "Sign Up"
   - **Check your email** for a confirmation link
   - Click the confirmation link
   - Go back to the app and log in

2. **Add Books**
   - Once logged in, click "Add Book"
   - Fill in book details
   - Start building your library!

### Returning Users

1. **Log In**
   - Enter your email and password
   - Click "Log In"
   - Your books will load automatically

2. **Sign Out**
   - Click the logout icon (top right)

---

## 🔒 Security Features

- **Passwords** are hashed and never stored in plain text
- **Row Level Security** ensures users can only see/edit their own books
- **Email confirmation** prevents fake accounts
- **Secure tokens** for authentication
- **HTTPS** encryption for all data transfer

---

## 🚀 Deploying to Vercel

### Option 1: Deploy from GitHub

1. **Push your code to GitHub** (including the `.env` file changes)
2. Go to https://vercel.com
3. Click "Add New" → "Project"
4. Select your GitHub repository
5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add `VITE_SUPABASE_URL` = `https://gscxdcsyrymcrntbpcvq.supabase.co`
   - Add `VITE_SUPABASE_ANON_KEY` = `your_anon_key`
6. Click "Deploy"
7. Done! Share your URL

### Option 2: Deploy via CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add your environment variables when asked.

---

## 📱 Features

### Current Features

- ✅ User authentication (email/password)
- ✅ Private bookshelves per user
- ✅ Three reading statuses (Want to Read, Currently Reading, Read)
- ✅ 5-star ratings
- ✅ Written reviews
- ✅ Cloud storage (Supabase)
- ✅ Real-time sync
- ✅ Responsive design (mobile & desktop)
- ✅ Sign out functionality

### Coming Soon

- 📧 Password reset via email
- 🔗 OAuth login (Google, GitHub)
- 📊 Reading statistics
- 🔍 Search and filter books
- 📤 Share reviews with friends

---

## 🐛 Troubleshooting

### "Invalid API key"
→ Check that your `.env` file has the correct `VITE_SUPABASE_ANON_KEY`

### "Failed to fetch"
→ Check your internet connection and Supabase project status

### "Email not confirmed"
→ Check your email inbox (and spam folder) for confirmation link

### Can't log in after signup
→ Make sure you clicked the email confirmation link first

### Books not loading
→ Check browser console (F12) for errors
→ Verify the database table was created correctly in Supabase

### Environment variables not working
→ Restart the dev server after creating/editing `.env` file
→ Make sure the file is named `.env` (with the dot)
→ Make sure it's in the root folder (same level as `package.json`)

---

## 🆘 Need Help?

1. Check the browser console (F12) for error messages
2. Check your Supabase project logs
3. Verify your `.env` file is set up correctly
4. Make sure the database table was created successfully

---

## 🎓 What You Learned

By setting this up, you've learned:
- User authentication with Supabase
- Database design and Row Level Security
- Environment variables in Vite
- Real-time database subscriptions
- Secure cloud deployment

---

**Your bookshelf is now secure, cloud-based, and ready for multiple users!** 🎉📚

Happy reading!
