// src/pages/auth/SignIn.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { signIn } from '../../api/apiCalls';

export default function SignIn() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null); const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true); 
    setErr(null);
    
    try {
      // Call backend API to sign in
      const response = await signIn({ email, password });
      
      if (response.success && response.session) {
        // Set the session in Supabase client so future requests work
        await supabase.auth.setSession({
          access_token: response.session.access_token,
          refresh_token: response.session.refresh_token,
        });
        
        navigate('/');
      } else {
        setErr(response.error || 'Sign in failed');
      }
    } catch (error: any) {
      setErr(error.response?.data?.error || error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md card">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Sign in</h1>
        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Email</label>
            <input className="input-field" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
          <div><label className="block text-sm font-medium mb-1">Password</label>
            <input className="input-field" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="text-sm text-gray-600 mt-4">No account? <Link to="/signup" className="text-primary-600">Sign up</Link></p>
      </div>
    </div>
  );
}