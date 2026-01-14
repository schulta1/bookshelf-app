import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase-client';
import Bookshelf from './components/Bookshelf';
import Auth from './components/Auth';

/**
 * App Component
 * 
 * Root component that manages authentication state.
 * Shows Auth page if not logged in, Bookshelf if logged in.
 */
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-wood-dark text-lg font-serif">Loading...</div>
      </div>
    );
  }

  return session ? <Bookshelf /> : <Auth />;
}

export default App;
