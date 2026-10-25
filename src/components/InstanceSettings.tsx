import React from 'react';
import { Cpu, Terminal, Save } from 'lucide-react';

interface InstanceSettingsProps {
  instance: {
    name: string;
    version: string;
    java_path?: string | null;
    max_ram_gb?: number | null;
    custom_jvm_args?: string | null;
  };
  onSave: (updates: Partial<InstanceSettingsProps['instance']>) => void;
}

export default function InstanceSettings({
  instance,
  onSave,
}: InstanceSettingsProps) {
  const [javaPath, setJavaPath] = React.useState(instance.java_path || '');
  const [maxRam, setMaxRam] = React.useState(instance.max_ram_gb?.toString() || '2');
  const [jvmArgs, setJvmArgs] = React.useState(instance.custom_jvm_args || '-Xmx2G -Xms256M');

  const handleSave = () => {
    onSave({
      java_path: javaPath || undefined,
      max_ram_gb: parseInt(maxRam, 10) || 2,
      custom_jvm_args: jvmArgs || undefined,
    });
  };

  return (
    <div className="om-card om-fade-in">
      <div className="om-card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Cpu size={20} style={{ color: 'var(--om-accent)' }} />
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{instance.name} — Settings</h2>
      </div>

      <div className="om-form-grid" style={{ marginTop: '1rem' }}>
        <div className="om-input-group">
          <label>Java executable path</label>
          <input
            className="om-input"
            placeholder="/usr/lib/jvm/java/bin/java"
            value={javaPath}
            onChange={(e) => setJavaPath(e.target.value)}
          />
        </div>

        <div className="om-input-group">
          <label>Max RAM (GB)</label>
          <input
            className="om-input"
            type="number"
            min="1"
            max="128"
            value={maxRam}
            onChange={(e) => setMaxRam(e.target.value)}
          />
        </div>

        <div className="om-input-group" style={{ gridColumn: 'span 2' }}>
          <label>Custom JVM arguments</label>
          <input
            className="om-input"
            placeholder="-Xmx2G -Xms256M -XX:+UseG1GC"
            value={jvmArgs}
            onChange={(e) => setJvmArgs(e.target.value)}
          />
          <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--om-text-dim)' }}>
            Applied when launching this instance.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="om-btn om-btn-primary"
          onClick={handleSave}
        >
          <Save size={16} /> Save settings
        </button>
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--om-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Terminal size={16} style={{ color: 'var(--om-text-muted)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--om-text-muted)', fontFamily: "'MinecraftFive', monospace" }}>
            Version: {instance.version}
          </span>
        </div>
      </div>
    </div>
  );
}
