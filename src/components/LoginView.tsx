import React, { useState } from 'react';
import { loginElyby, ElybyLoginRequest } from '../lib/tauri';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';

export interface LoginViewProps {
  onLogin: (token: string) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: ElybyLoginRequest = { username, password };
      const res = await loginElyby(payload);
      onLogin(res.token);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="om-login">
      <div className="om-login-card om-card om-fade-in">
        <div className="om-login-header" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div className="om-brand-icon" style={{ width: 28, height: 28, fontSize: '0.9rem' }}>O</div>
            <h1 className="om-login-title">OmLauncher</h1>
          </div>
          <p className="om-login-subtitle">
            Sign in to your Ely.by account to access your instances.
          </p>
        </div>

        {error && (
          <div className="om-error">
            <AlertCircle size={16} style={{ marginRight: '0.5rem' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="om-input-group">
            <label htmlFor="username">Ely.by username</label>
            <input
              id="username"
              className="om-input"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-ely-username"
              disabled={loading}
            />
          </div>

          <div className="om-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="om-input"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="om-btn om-btn-primary om-w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Signing in…
              </>
            ) : (
              <>
                <LogIn size={18} /> Sign in
              </>
            )}
          </button>

          <div className="om-login-divider">or continue offline</div>

          <button
            type="button"
            className="om-btn om-btn-ghost om-w-full"
            onClick={() => onLogin('offline-token')}
            disabled={loading}
          >
            Enter launcher
          </button>
        </form>
      </div>
    </div>
  );
}
