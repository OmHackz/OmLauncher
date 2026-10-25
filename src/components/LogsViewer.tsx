import { useEffect, useRef, useState } from 'react';
import { RefreshCw, Download, Maximize2, Minimize2 } from 'lucide-react';

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  time: string;
}

interface LogsViewerProps {
  instanceName: string;
  logLines?: LogEntry[];
}

export default function LogsViewer({
  instanceName,
  logLines = [],
}: LogsViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logLines, autoScroll]);

  const levelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'om-log-error';
      case 'warn': return 'om-log-warn';
      case 'debug': return 'om-log-debug';
      default: return 'om-log-info';
    }
  };

  return (
    <div className="om-card om-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="om-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ color: 'var(--om-accent)' }}>{expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</div>
          <h2 style={{ margin: 0, fontSize: '1rem' }}>{instanceName} — logs</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label className="om-switch" style={{ cursor: 'pointer', marginRight: '0.5rem' }}>
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            <div className="om-switch-slider" />
          </label>
          <button
            className="om-btn om-btn-ghost"
            onClick={() => setExpanded(!expanded)}
            style={{ padding: '0.4rem 0.7rem', fontSize: '0.75rem' }}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
          <button className="om-btn om-btn-ghost" style={{ padding: '0.4rem 0.7rem', fontSize: '0.75rem' }}>
            <RefreshCw size={16} />
          </button>
          <button className="om-btn om-btn-ghost" style={{ padding: '0.4rem 0.7rem', fontSize: '0.75rem' }}>
            <Download size={16} />
          </button>
        </div>
      </div>

      <div
        className="om-logs"
        style={{ height: expanded ? '400px' : '180px' }}
      >
        <div className="om-logs-header">
          <span style={{ fontFamily: "'MinecraftFive', monospace", fontSize: '0.7rem', color: 'var(--om-text-muted)' }}>
            {`latest.log · ${logLines.length} entries`}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--om-text-dim)' }}>
            Auto-scroll: {autoScroll ? 'on' : 'off'}
          </span>
        </div>
        <div className="om-logs-content">
          {logLines.map((entry, i) => (
            <div key={i} className={`om-log-line ${levelColor(entry.level)}`}>
              [{entry.time}] {entry.message}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
