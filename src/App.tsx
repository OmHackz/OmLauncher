import { useState, useEffect, useCallback } from 'react';
import {
  getElybyToken,
  logoutElyby,
  listInstances,
  InstanceSummary,
} from './lib/tauri';
import LoginView from './components/LoginView';
import Dashboard from './components/Dashboard';

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [instances, setInstances] = useState<InstanceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Check for an existing Ely.by token on startup.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getElybyToken();
        setAuthenticated(!!token);
      } catch {
        setAuthenticated(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshInstances = useCallback(async () => {
    try {
      const data = await listInstances();
      setInstances(data);
    } catch (err) {
      console.error('Failed to list instances:', err);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      refreshInstances();
    }
  }, [authenticated, refreshInstances]);

  const handleLogin = async () => {
    setAuthenticated(true);
    await refreshInstances();
  };

  const handleLogout = async () => {
    await logoutElyby();
    setAuthenticated(false);
    setInstances([]);
  };

  if (loading) {
    return (
      <div className="om-loading">
        <div className="om-spinner" />
        <div>Initialising OmLauncher…</div>
      </div>
    );
  }

  return (
    <div className="om-app om-fade-in">
      {!authenticated ? (
        <LoginView onLogin={handleLogin} />
      ) : (
        <Dashboard
          instances={instances}
          onRefresh={refreshInstances}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
