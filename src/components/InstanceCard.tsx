import React from 'react';
import {
  Play,
  Trash2,
  FolderOpen,
  MoreHorizontal,
} from 'lucide-react';
import { InstanceSummary } from '../lib/tauri';

interface InstanceCardProps {
  instance: InstanceSummary;
  isActive: boolean;
  onSelect: (id: string) => void;
  onLaunch: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onOpenFolder: (id: string) => void;
}

export default function InstanceCard({
  instance,
  isActive,
  onSelect,
  onLaunch,
  onRename,
  onDelete,
  onOpenFolder,
}: InstanceCardProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [renameInput, setRenameInput] = React.useState(instance.name);

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameInput.trim() && renameInput !== instance.name) {
      onRename(instance.id, renameInput.trim());
    }
    setMenuOpen(false);
  };

  return (
    <div
      className={`om-instance-card ${isActive ? 'is-active' : ''}`}
      onClick={() => onSelect(instance.id)}
    >
      <div className="om-instance-header">
        {instance.icon ? (
          <img
            className="om-instance-icon"
            src={instance.icon}
            alt={`${instance.name} icon`}
          />
        ) : (
          <div className="om-instance-icon-placeholder">
            {instance.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="om-instance-badge">{instance.version}</span>
      </div>
      <div className="om-instance-body">
        <h3 className="om-instance-name">{instance.name}</h3>
        <div className="om-instance-version">
          Last launched{' '}
          {instance.last_launched
            ? new Date(instance.last_launched * 1000).toLocaleDateString()
            : 'never'}
        </div>
      </div>
      <div className="om-instance-footer">
        <button
          className="om-btn om-btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            onLaunch(instance.id);
          }}
          title="Launch instance"
        >
          <Play size={14} /> Launch
        </button>
        <button
          className="om-btn om-btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            onOpenFolder(instance.id);
          }}
          title="Open folder"
        >
          <FolderOpen size={14} />
        </button>
        <button
          className="om-btn om-btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          title="More options"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {menuOpen && (
        <div className="om-card" style={{ position: 'absolute', top: '100%', right: 0, width: 180, marginTop: 6, zIndex: 50, boxShadow: 'var(--om-shadow-lg)' }}>
          <form onSubmit={handleRenameSubmit} style={{ padding: '0.5rem', borderBottom: '1px solid var(--om-border)' }}>
            <input
              className="om-input"
              autoFocus
              defaultValue={instance.name}
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              placeholder="New name"
            />
          </form>
          <button
            className="om-btn om-btn-ghost om-w-full"
            style={{ justifyContent: 'flex-start', padding: '0.6rem 1rem' }}
            onClick={() => {
              setMenuOpen(false);
              onDelete(instance.id);
            }}
          >
            <Trash2 size={14} style={{ marginRight: '0.5rem' }} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
