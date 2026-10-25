import { useState } from 'react';
import { Image, Trash2, ArrowUp } from 'lucide-react';

interface ResourcePackEntry {
  name: string;
  active: boolean;
}

interface ResourcePackManagerProps {
  instanceName: string;
  packs: ResourcePackEntry[];
  onToggle: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function ResourcePackManager({
  instanceName,
  packs,
  onToggle,
  onDelete,
}: ResourcePackManagerProps) {
  const [newPack, setNewPack] = useState('');

  return (
    <div className="om-card om-fade-in">
      <div className="om-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image size={20} style={{ color: 'var(--om-accent)' }} />
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Resource Packs — {instanceName}</h2>
        </div>
      </div>

      <div className="om-list">
        {packs.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--om-text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
            No resource packs installed.
          </div>
        ) : (
          packs.map((pack) => (
            <div key={pack.name} className="om-list-item">
              <div
                className="om-list-icon"
                style={{ background: pack.active ? 'var(--om-accent)' : 'var(--om-block-stone)' }}
              >
                {pack.active ? <Image size={16} style={{ color: '#fff' }} /> : <Image size={16} style={{ opacity: 0.5 }} />}
              </div>
              <div className="om-list-info">
                <div className="om-list-name" title={pack.name}>{pack.name}</div>
                <div className="om-list-meta">{pack.active ? 'Active' : 'Inactive'}</div>
              </div>
              <div className="om-list-actions">
                <button
                  className="om-btn om-btn-ghost"
                  onClick={() => onToggle(pack.name)}
                  title={pack.active ? 'Deactivate' : 'Activate'}
                >
                  {pack.active ? <Image size={14} style={{ opacity: 0.6 }} /> : <Image size={14} />}
                </button>
                <button
                  className="om-btn om-btn-ghost"
                  onClick={() => onDelete(pack.name)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          className="om-input"
          placeholder="pack.zip"
          value={newPack}
          onChange={(e) => setNewPack(e.target.value)}
        />
        <button className="om-btn om-btn-ghost" onClick={() => setNewPack('')}>
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
