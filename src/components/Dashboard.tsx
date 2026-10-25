import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Plus,
  FolderOpen,
  LogOut,
  Sun,
  Moon,
  Settings,
  Play,
} from 'lucide-react';
import { openInstanceFolder, deleteInstance, launchInstance } from '../lib/tauri';
import InstanceCard from './InstanceCard';
import ModpackBrowser from './ModpackBrowser';
import ModsManager from './ModsManager';
import ResourcePackManager from './ResourcePackManager';
import LogsViewer from './LogsViewer';
import InstanceSettings from './InstanceSettings';

type Tab = 'overview' | 'settings' | 'mods' | 'resourcepacks' | 'logs';

interface DashboardProps {
  instances: Array<{
    id: string;
    name: string;
    version: string;
    path: string;
    icon?: string | null;
    last_launched?: number | null;
  }>;
  onRefresh: () => Promise<void>;
  onLogout: () => Promise<void>;
}

export default function Dashboard({
  instances,
  onRefresh,
  onLogout,
}: DashboardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [launching, setLaunching] = useState<string | null>(null);

  const selected = instances.find((i) => i.id === selectedId) || null;

  // Select first instance by default.
  useEffect(() => {
    if (!selectedId && instances.length > 0) {
      setSelectedId(instances[0].id);
      setTab('overview');
    }
  }, [instances, selectedId]);

  const handleCreate = async () => {
    const name = window.prompt('Instance name:');
    if (!name) return;
    const version = window.prompt('Minecraft version (e.g. 1.20.1):', '1.20.1');
    if (!version) return;
    try {
      const { createInstance } = await import('../lib/tauri');
      await createInstance({ name, version, username: null });
      await onRefresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to create instance.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this instance and all its data?')) return;
    try {
      await deleteInstance({ instance_id: id });
      await onRefresh();
      if (selectedId === id) {
        setSelectedId(instances.find((i) => i.id !== id)?.id || null);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to delete instance.');
    }
  };

  const handleRename = async (id: string, newName: string) => {
    try {
      const { renameInstance } = await import('../lib/tauri');
      await renameInstance({ instance_id: id, new_name: newName });
      await onRefresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to rename instance.');
    }
  };

  const handleLaunch = async (id: string) => {
    setLaunching(id);
    try {
      const res = await launchInstance({ instance_id: id });
      if (res.java_command) {
        // In a production build this would be handed to a shell spawn command.
        window.alert(`Launch command prepared:\n${res.java_command}`);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to launch instance.');
    } finally {
      setLaunching(null);
    }
  };

  const handleThemeToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  if (!selected) {
    return (
      <div className="om-main om-page om-fade-in">
        <div className="om-dashboard-header">
          <h1>OmLauncher</h1>
        </div>
        <div className="om-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧱</div>
          <h2>No instances yet</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--om-text-muted)' }}>
            Create your first Minecraft instance to get started.
          </p>
          <button
            className="om-btn om-btn-primary"
            onClick={handleCreate}
            style={{ marginTop: '1rem' }}
          >
            <Plus size={18} /> Create instance
          </button>
        </div>
      </div>
    );
  }

  // Demo mod / resource pack data — in production this is read from disk.
  const demoMods = [
    { name: 'sodium.jar', enabled: true },
    { name: 'lithium.jar', enabled: true },
    { name: 'iris.jar', enabled: false },
  ];

  const demoPacks = [
    { name: 'Default 3D', active: true },
    { name: 'Faithful 32x', active: false },
  ];

  // Demo logs — in production these are tailed from the instance log file.
  const demoLogs = [
    { level: 'info' as const, message: 'OmLauncher initialised.', time: '10:00:01' },
    { level: 'info' as const, message: `Loading instance "${selected.name}" (${selected.version})...`, time: '10:00:02' },
    { level: 'info' as const, message: 'Resolved Java at /usr/lib/jvm/java-17.', time: '10:00:03' },
    { level: 'warn' as const, message: 'Mod "iris.jar" is disabled.', time: '10:00:04' },
    { level: 'info' as const, message: 'Launching Minecraft...', time: '10:00:05' },
  ];

  return (
    <div className="om-app om-fade-in">
      <div className="om-sidebar">
        <div className="om-sidebar-header">
          <a
            href="#"
            className="om-sidebar-brand"
            onClick={(e) => { e.preventDefault(); setSelectedId(null); }}
          >
            <div className="om-brand-icon">O</div>
            OmLauncher
          </a>
        </div>

        <div className="om-section-title">Instances</div>
        <div className="om-grid" style={{ padding: 0 }}>
          {instances.map((inst) => (
            <InstanceCard
              key={inst.id}
              instance={inst}
              isActive={selectedId === inst.id}
              onSelect={setSelectedId}
              onLaunch={(id) => {
                setLaunching(id);
                launchInstance({ instance_id: id })
                  .then((res) => {
                    if (res.java_command) {
                      window.alert(`Launch:\n${res.java_command}`);
                    }
                  })
                  .catch((err: any) => alert(err?.message || 'Launch failed'))
                  .finally(() => setLaunching(null));
              }}
              onRename={handleRename}
              onDelete={handleDelete}
              onOpenFolder={async (id) => {
                await openInstanceFolder(id);
              }}
            />
          ))}
          <button
            className="om-btn om-btn-primary om-w-full"
            style={{ margin: '1rem 1rem 0 1rem' }}
            onClick={handleCreate}
          >
            <Plus size={16} /> Add instance
          </button>
        </div>

        <div className="om-section-title" style={{ marginTop: 'auto' }}>
          Theme
        </div>
        <button
          className="om-btn om-btn-ghost om-w-full"
          style={{ margin: '0 1rem 1rem 1rem', justifyContent: 'space-between' }}
          onClick={handleThemeToggle}
        >
          <span>{theme === 'dark' ? 'Switch to light' : 'Switch to dark'}</span>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          className="om-btn om-btn-danger om-w-full"
          style={{ margin: '0 1rem 1rem 1rem' }}
          onClick={onLogout}
        >
          <LogOut size={16} style={{ marginRight: '0.5rem' }} /> Sign out
        </button>
      </div>

      <div className="om-main">
        <div className="om-page">
          <div className="om-dashboard-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <LayoutDashboard size={24} style={{ color: 'var(--om-accent)' }} />
              <h1>{selected.name}</h1>
              <span style={{ fontSize: '0.8rem', color: 'var(--om-text-muted)' }}>
                v{selected.version}
              </span>
            </div>
            <div className="om-actions">
              <button
                className="om-btn om-btn-primary"
                disabled={launching === selected.id}
                onClick={() => handleLaunch(selected.id)}
              >
                {launching === selected.id ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  </>
                ) : (
                  <Play size={16} />
                )}
                Launch
              </button>
              <button
                className="om-btn om-btn-ghost"
                onClick={() => openInstanceFolder(selected.id)}
              >
                <FolderOpen size={16} /> Open folder
              </button>
              <button
                className="om-btn om-btn-ghost"
                onClick={() => setTab('settings')}
              >
                <Settings size={16} /> Settings
              </button>
            </div>
          </div>

          <div className="om-grid" style={{ marginBottom: '1.5rem' }}>
            {tab === 'overview' && (
              <>
                <div className="om-modpack-grid">
                  <ModpackBrowser
                    instancePath={selected.path}
                    onInstalled={onRefresh}
                  />
                </div>
              </>
            )}

            {tab === 'mods' && (
              <ModsManager
                instanceName={selected.name}
                mods={demoMods}
                onToggle={() => {}}
                onDelete={() => {}}
              />
            )}

            {tab === 'resourcepacks' && (
              <ResourcePackManager
                instanceName={selected.name}
                packs={demoPacks}
                onToggle={() => {}}
                onDelete={() => {}}
              />
            )}

            {tab === 'logs' && (
              <LogsViewer instanceName={selected.name} logLines={demoLogs} />
            )}
          </div>

          {tab === 'settings' && (
            <InstanceSettings
              instance={{
                name: selected.name,
                version: selected.version,
                java_path: undefined,
                max_ram_gb: 2,
                custom_jvm_args: '-Xmx2G -Xms256M',
              }}
              onSave={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}
