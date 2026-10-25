import React, { useState, useEffect } from 'react';
import { fetchModrinthPacks, downloadModpack, ModrinthPack } from '../lib/tauri';
import { Search, Package, Loader2 } from 'lucide-react';

interface ModpackBrowserProps {
  instancePath: string;
  onInstalled: () => void;
}

export default function ModpackBrowser({
  instancePath,
  onInstalled,
}: ModpackBrowserProps) {
  const [query, setQuery] = useState('');
  const [packs, setPacks] = useState<ModrinthPack[]>([]);
  const [loading, setLoading] = useState(false);
  const [installing, setInstalling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = async (q: string) => {
    if (!q.trim()) {
      setPacks([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchModrinthPacks({ query: q, limit: 24 });
      setPacks(res.packs);
    } catch (err: any) {
      setError(err?.message || 'Failed to search Modrinth.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleInstall = async (pack: ModrinthPack) => {
    setInstalling(pack.id);
    try {
      const res = await downloadModpack({
        pack_id: pack.id,
        version_id: pack.versions[0] || null,
        instance_path: instancePath,
      });
      if (res.ok) {
        onInstalled();
      } else {
        setError(res.message || 'Install failed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Install failed.');
    } finally {
      setInstalling(null);
    }
  };

  return (
    <div className="om-card om-fade-in">
      <div className="om-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={20} style={{ color: 'var(--om-accent)' }} />
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Modpack Browser</h2>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--om-text-muted)' }}>{packs.length} results</span>
      </div>

      <div className="om-search-bar">
        <Search size={18} className="om-search-icon" />
        <input
          className="om-input"
          placeholder="Search modpacks on Modrinth…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="om-error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading && !packs.length ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--om-text-muted)' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : packs.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--om-text-muted)' }}>
          {!query ? 'Search for modpacks to get started.' : 'No modpacks found.'}
        </div>
      ) : (
        <div className="om-modpack-grid">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="om-modpack-card"
              onClick={() => handleInstall(pack)}
              style={{ cursor: 'pointer' }}
            >
              <div className="om-modpack-media">
                {pack.icon_url ? (
                  <img
                    className="om-modpack-image"
                    src={pack.icon_url}
                    alt={pack.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="om-modpack-image-placeholder">
                    {pack.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="om-modpack-body">
                <h3 className="om-modpack-title">{pack.title}</h3>
                {pack.description && (
                  <p className="om-modpack-desc">{pack.description}</p>
                )}
              </div>
              <div className="om-modpack-footer">
                <span className="om-modpack-downloads">
                  {pack.downloads?.toLocaleString()} downloads
                </span>
                {installing === pack.id ? (
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--om-accent)' }}>Install →</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
