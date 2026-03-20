'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken',  data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userName',     data.user.name);
      toast.success(`Welcome back, ${data.user.name}.`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div className="animate-fade-up" style={{ width: '100%', maxWidth: '420px' }}>

        {/* Masthead */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          {/* Decorative seal */}
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 1.25rem',
            border: '2px solid var(--gold)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--gold-dim)',
            boxShadow: '0 0 0 6px var(--bg), 0 0 0 7px var(--border)',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="var(--gold)" strokeWidth="1.5"/>
              <path d="M7 8h4M7 12h2" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--ink)',
            letterSpacing: '-0.01em',
            marginBottom: '0.25rem',
          }}>
            TaskLedger
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            color: 'var(--ink-faint)',
            fontSize: '0.95rem',
          }}>
            Sign in to your account
          </p>
        </div>

        {/* Form card */}
        <div className="paper" style={{ padding: '2.25rem 2rem' }}>
          {/* Top rule */}
          <div style={{
            height: '3px',
            background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
            margin: '-2.25rem -2rem 2rem',
            borderRadius: '2px 2px 0 0',
          }} />

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label-classic">Email Address</label>
              <input
                type="email"
                className="input-classic"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label-classic">Password</label>
              <input
                type="password"
                className="input-classic"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn-classic"
              style={{ width: '100%', marginTop: '0.25rem', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="divider" style={{ margin: '1.75rem 0 1.25rem' }}>or</div>

          <p style={{
            textAlign: 'center',
            color: 'var(--ink-faint)',
            fontSize: '0.92rem',
            fontStyle: 'italic',
          }}>
            New here?{' '}
            <Link href="/register" style={{
              color: 'var(--gold)',
              fontStyle: 'normal',
              fontWeight: 500,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}>
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: 'var(--ink-ghost)',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Your tasks, kept in order.
        </p>
      </div>
    </div>
  );
}
