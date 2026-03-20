'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Account created. Please sign in.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--ink-faint)', fontSize: '0.95rem' }}>
            Open a new account
          </p>
        </div>

        {/* Form card */}
        <div className="paper" style={{ padding: '2.25rem 2rem' }}>
          <div style={{
            height: '3px',
            background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
            margin: '-2.25rem -2rem 2rem',
            borderRadius: '2px 2px 0 0',
          }} />

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label-classic">Full Name</label>
              <input
                type="text"
                className="input-classic"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="divider" style={{ margin: '1.75rem 0 1.25rem' }}>or</div>

          <p style={{ textAlign: 'center', color: 'var(--ink-faint)', fontSize: '0.92rem', fontStyle: 'italic' }}>
            Already registered?{' '}
            <Link href="/login" style={{
              color: 'var(--gold)',
              fontStyle: 'normal',
              fontWeight: 500,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}>
              Sign in
            </Link>
          </p>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '1.5rem',
          color: 'var(--ink-ghost)', fontSize: '0.78rem',
          fontFamily: 'var(--font-display)', letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Your tasks, kept in order.
        </p>
      </div>
    </div>
  );
}
