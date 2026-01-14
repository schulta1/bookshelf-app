import React, { useState } from 'react';
import { supabase } from '../services/supabase-client';
import { BookOpen } from 'lucide-react';

/**
 * Auth Component
 * 
 * Handles user authentication (login and signup).
 * Displayed when user is not authenticated.
 */
export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        setMessage('Check your email for the confirmation link!');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-cream-light rounded-3xl shadow-2xl p-8 max-w-md w-full border border-wood-light">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-amber-warm p-4 rounded-2xl mb-4">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-wood-darker mb-2">
            My Bookshelf
          </h1>
          <p className="text-wood-dark">
            Track your reading journey
          </p>
        </div>
        
        {/* Messages */}
        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-lg text-green-800 text-sm">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}
        
        {/* Auth form */}
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
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border border-wood-light bg-white
                text-wood-darker placeholder-wood-light
                focus:outline-none focus:ring-2 focus:ring-amber-warm
                transition-all"
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
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-wood-light bg-white
                text-wood-darker placeholder-wood-light
                focus:outline-none focus:ring-2 focus:ring-amber-warm
                transition-all"
            />
            {mode === 'signup' && (
              <p className="text-xs text-wood-dark mt-1">
                Minimum 6 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-warm hover:bg-amber-glow
              text-white font-semibold rounded-lg
              shadow-md hover:shadow-lg
              transform hover:-translate-y-0.5
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
              setMessage('');
            }}
            className="text-wood-dark hover:text-wood-darker font-medium transition-colors"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Log in'}
          </button>
        </div>

        {/* Info text */}
        <div className="mt-8 pt-6 border-t border-wood-light">
          <p className="text-sm text-wood-dark text-center">
            Your personal reading tracker. Each user has their own private bookshelf.
          </p>
        </div>
      </div>
    </div>
  );
}
