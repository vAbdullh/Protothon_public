'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/admin');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setMessage('Magic link sent to your email!');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        
        {showPassword && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        )}

        <div className="flex gap-2">
          {!showPassword ? (
            <>
              <button
                onClick={() => setShowPassword(true)}
                className="flex-1 p-2 bg-green-500 rounded hover:bg-green-600"
              >
                Login with Password
              </button>
              <button
                onClick={handleMagicLink}
                disabled={isLoading}
                className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </>
          ) : (
            <button
              onClick={handlePasswordLogin}
              disabled={isLoading}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          )}
        </div>
      </form>

      {message && (
        <p className={`mt-4 text-sm ${message.includes('Magic link') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
