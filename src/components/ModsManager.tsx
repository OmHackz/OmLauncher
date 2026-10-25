import { useState } from 'react';
import { Trash2, EyeOff, Eye, Plus, Box } from 'lucide-react';

interface ModEntry {
  name: string;
  enabled: boolean;
}

interface ModsManagerProps {
  instanceName: string;
  mods: ModEntry[];
  onToggle: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function ModsManager({
  instanceName,
  mods,
  onToggle,
  onDelete,
}: ModsManagerProps) {
  const [newMod, setNewMod] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newMod.trim();
    if (!name) return;
    onToggle(name); // treated as add-enable in this demo
    setNewMod('');
  };

  return (
    <div className="om-card om-fade-in">
      <div className="om-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Box size={20} style={{ color: 'var(--om-accent)' }} />
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Mods — {instanceName}</h2>
        </div>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          className="om-input"
          placeholder="Add mod file name (e.g. sodium.jar)"
          value={newMod}
          onChange={(e) => setNewMod(e.target.value)}
        />
        <button className="om-btn om-btn-primary" type="submit">
          <Plus size={16} />
        </button>
      </form>

      <div className="om-list">
        {mods.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--om-text-muted)' }}>
            No mods installed. Use the Modpack Browser to add content.
          </div>
        ) : (
          mods.map((mod) => (
            <div key={mod.name} className="om-list-item">
              <div
                className="om-list-icon"
                style={{ background: mod.enabled ? 'var(--om-accent)' : 'var(--om-block-stone)' }}
              >
                {mod.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
              </div>
              <div className="om-list-info">
                <div className="om-list-name" title={mod.name}>{mod.name}</div>
                <div className="om-list-meta">
                  {mod.enabled ? 'Enabled' : 'Disabled'} · {mod.name.endsWith('.jar') ? 'Mod' : 'File'}
                </div>
              </div>
              <div className="om-list-actions">
                <button
                  className="om-btn om-btn-ghost"
                  onClick={() => onToggle(mod.name)}
                  title={mod.enabled ? 'Disable' : 'Enable'}
                >
                  {mod.enabled ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  className="om-btn om-btn-ghost"
                  onClick={() => onDelete(mod.name)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
