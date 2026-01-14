# 🔄 Database Migration Guide

This guide will help you migrate from localStorage to a production database (Supabase or Firebase).

## Table of Contents
- [Supabase Migration](#supabase-migration)
- [Firebase Migration](#firebase-migration)
- [React Native Conversion](#react-native-conversion)

---

## 📦 Supabase Migration

Supabase is recommended for its simplicity and PostgreSQL foundation.

### Step 1: Setup Supabase

1. **Create a Supabase account**: https://supabase.com
2. **Create a new project**
3. **Get your credentials** from Project Settings → API

### Step 2: Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Step 3: Create Supabase Client

Create `src/services/supabase-client.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Create `.env` file:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Create Database Schema

In Supabase SQL Editor, run:

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

-- Create policy: Users can only see their own books
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

-- Create index for faster queries
CREATE INDEX books_user_id_idx ON books(user_id);
CREATE INDEX books_status_idx ON books(status);

-- Function to automatically update updated_at
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

### Step 5: Replace Storage Service

Replace `src/services/storage.js` with `src/services/supabase-storage.js`:

```javascript
import { supabase } from './supabase-client';

// Convert camelCase to snake_case for database
function toSnakeCase(obj) {
  return {
    id: obj.id,
    user_id: obj.userId,
    title: obj.title,
    author: obj.author,
    cover_url: obj.coverUrl,
    status: obj.status,
    rating: obj.rating,
    review: obj.review,
    created_at: obj.createdAt,
    updated_at: obj.updatedAt,
    finished_at: obj.finishedAt,
  };
}

// Convert snake_case to camelCase for app
function toCamelCase(obj) {
  return {
    id: obj.id,
    userId: obj.user_id,
    title: obj.title,
    author: obj.author,
    coverUrl: obj.cover_url,
    status: obj.status,
    rating: obj.rating,
    review: obj.review,
    createdAt: obj.created_at,
    updatedAt: obj.updated_at,
    finishedAt: obj.finished_at,
  };
}

export async function getAllBooks() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  return data.map(toCamelCase);
}

export async function addBook(book) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const bookData = {
    ...toSnakeCase(book),
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('books')
    .insert([bookData])
    .select()
    .single();

  if (error) {
    console.error('Error adding book:', error);
    throw error;
  }

  return toCamelCase(data);
}

export async function updateBook(bookId, updates) {
  const { data, error } = await supabase
    .from('books')
    .update(toSnakeCase(updates))
    .eq('id', bookId)
    .select()
    .single();

  if (error) {
    console.error('Error updating book:', error);
    throw error;
  }

  return toCamelCase(data);
}

export async function deleteBook(bookId) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId);

  if (error) {
    console.error('Error deleting book:', error);
    return false;
  }

  return true;
}

export async function getBooksByStatus(status) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  return data.map(toCamelCase);
}

// Real-time subscription
export function subscribeToBooks(callback) {
  const subscription = supabase
    .channel('books_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'books' 
      }, 
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}
```

### Step 6: Add Authentication

Create `src/components/Auth.jsx`:

```javascript
import React, { useState } from 'react';
import { supabase } from '../services/supabase-client';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'signup'

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="font-serif text-3xl font-bold text-wood-darker mb-6 text-center">
          My Bookshelf
        </h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-wood-dark mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-wood-light
                focus:outline-none focus:ring-2 focus:ring-amber-warm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-wood-dark mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-wood-light
                focus:outline-none focus:ring-2 focus:ring-amber-warm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-warm hover:bg-amber-glow
              text-white font-semibold rounded-lg
              transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full mt-4 text-wood-dark hover:text-wood-darker"
        >
          {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
        </button>
      </div>
    </div>
  );
}
```

### Step 7: Update App.jsx

```javascript
import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase-client';
import Bookshelf from './components/Bookshelf';
import Auth from './components/Auth';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return session ? <Bookshelf /> : <Auth />;
}

export default App;
```

### Step 8: Update Bookshelf Component

Update imports and make functions async:

```javascript
import { 
  getAllBooks, 
  addBook, 
  updateBook, 
  deleteBook,
  subscribeToBooks 
} from '../services/supabase-storage';

// Update useEffect
useEffect(() => {
  async function loadBooks() {
    const loaded = await getAllBooks();
    setBooks(loaded);
  }
  
  loadBooks();

  // Subscribe to real-time changes
  const unsubscribe = subscribeToBooks((payload) => {
    // Reload books on any change
    loadBooks();
  });

  return () => unsubscribe();
}, []);

// Update handlers to be async
const handleAddBook = async (book) => {
  await addBook(book);
  const updated = await getAllBooks();
  setBooks(updated);
};
```

---

## 🔥 Firebase Migration

### Step 1: Setup Firebase

1. **Create Firebase project**: https://console.firebase.google.com
2. **Enable Authentication** (Email/Password)
3. **Enable Firestore Database**
4. **Get your config** from Project Settings

### Step 2: Install Dependencies

```bash
npm install firebase
```

### Step 3: Create Firebase Config

Create `src/services/firebase-config.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Step 4: Create Firestore Service

Create `src/services/firebase-storage.js`:

```javascript
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db, auth } from './firebase-config';

const COLLECTION = 'books';

export async function getAllBooks() {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function addBook(book) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('Not authenticated');

  const docRef = await addDoc(collection(db, COLLECTION), {
    ...book,
    userId,
  });

  return { id: docRef.id, ...book };
}

export async function updateBook(bookId, updates) {
  const docRef = doc(db, COLLECTION, bookId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Date.now(),
  });
  return { id: bookId, ...updates };
}

export async function deleteBook(bookId) {
  await deleteDoc(doc(db, COLLECTION, bookId));
  return true;
}

// Real-time subscription
export function subscribeToBooks(callback) {
  const userId = auth.currentUser?.uid;
  if (!userId) return () => {};

  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const books = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(books);
  });
}
```

---

## 📱 React Native Conversion

### Key Changes Needed

1. **Replace Tailwind** with React Native StyleSheet
2. **Replace HTML elements** with React Native components
3. **Use Async Storage** instead of localStorage
4. **Add navigation** with React Navigation

### Example Component Conversion

```javascript
// Web (Current)
<div className="flex items-center gap-2">
  <button className="px-4 py-2 bg-amber-warm">
    Add Book
  </button>
</div>

// React Native
<View style={styles.container}>
  <TouchableOpacity style={styles.button}>
    <Text style={styles.buttonText}>Add Book</Text>
  </TouchableOpacity>
</View>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
  },
});
```

---

## 🎯 Migration Checklist

- [ ] Choose database (Supabase recommended)
- [ ] Set up database project and get credentials
- [ ] Create database schema
- [ ] Install database SDK
- [ ] Create database client
- [ ] Replace storage service
- [ ] Add authentication
- [ ] Update all component functions to async
- [ ] Test CRUD operations
- [ ] Implement real-time sync
- [ ] Add error handling
- [ ] Test offline behavior
- [ ] Add loading states
- [ ] Deploy!

---

## 💡 Pro Tips

1. **Test locally first**: Use Supabase local development
2. **Migrate data**: Export localStorage JSON, import to database
3. **Keep localStorage as fallback**: Detect if database is unavailable
4. **Add optimistic updates**: Update UI before database confirms
5. **Handle conflicts**: Implement last-write-wins or conflict resolution

---

Happy migrating! 🚀
