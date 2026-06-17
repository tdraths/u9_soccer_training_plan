import { useState } from 'react';
import { DRILL_DIAGRAM_MAP } from '../lib/diagrams.jsx';
import { DrillPicker } from './DrillPicker.jsx';

export function SessionModal({ week, onClose, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [picking, setPicking] = useState(null); // { type, stationIdx }

  if (!week) return null;

  const handleSwap = (type, stationIdx = null) => {
    setPicking({ type, stationIdx });
  };

  const handlePickerSelect = (item) => {
    const updated = { ...week, stations: [...week.stations] };
    if (picking.type === 'warmup') {
      updated.warmup = { name: item.name, duration: '8 min', desc: item.desc };
    } else if (picking.type === 'station') {
      updated.stations[picking.stationIdx] = { name: item.name, duration: '8 min', desc: item.desc };
    } else if (picking.type === 'smallSided') {
      updated.smallSided = { format: item.format || item.name, duration: '15 min', rules: item.desc };
    }
    onUpdate(updated);
    setPicking(null);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          zIndex: 50, overflowY: 'auto', padding: 16,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#0f172a', borderRadius: 14, maxWidth: 660, width: '100%',
            border: `2px solid ${week.colour}`, overflow: 'hidden', marginBottom: 20,
          }}
        >
          {/* Header */}
          <div style={{ background: week.colour, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', marginBottom: 3, letterSpacing: '1px' }}>
                  ROTATION {week.rotation} · WEEK {week.week}
                </div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>{week.theme}</h2>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setEditMode(m => !m)}
                  style={{
                    padding: '6px 12px', border: 'none', borderRadius: 7,
                    background: editMode ? '#fff' : 'rgba(255,255,255,0.2)',
                    color: editMode ? week.colour : '#fff',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {editMode ? '✓ Done' : '✏️ Edit'}
                </button>
                <button
                  onClick={onClose}
                  style={{
                    background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
                    borderRadius: 7, width: 30, height: 30, fontSize: 14, cursor: 'pointer',
                  }}
                >✕</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {['⏱ 60 min', '👦 U9', '⚽ 14–24 players'].map(t => (
                <span key={t} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 5, padding: '2px 8px', fontSize: 11 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '18px 20px' }}>
            {/* Warm-up */}
            <SessionBlock
              label="🌡️ WARM-UP" duration="8 min" colour="#f59e0b"
              editMode={editMode} onSwap={() => handleSwap('warmup')}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color: '#fbbf24' }}>{week.warmup.name}</div>
              <p style={{ margin: '6px 0 0', color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{week.warmup.desc}</p>
              <DrillDiagram name={week.warmup.name} />
            </SessionBlock>

            {/* Stations */}
            <div style={{ fontSize: 11, fontWeight: 800, color: week.colour, letterSpacing: '1px', margin: '4px 0 8px' }}>
              🔵 STATIONS — rotate every 8 minutes
            </div>
            {week.stations.map((s, i) => (
              <SessionBlock
                key={i}
                label={`Station ${i + 1}`} duration="8 min" colour={week.colour}
                editMode={editMode} onSwap={() => handleSwap('station', i)}
              >
                <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{s.name}</div>
                <p style={{ margin: '5px 0 0', color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
                <DrillDiagram name={s.name} />
              </SessionBlock>
            ))}

            {/* Small-sided */}
            <SessionBlock
              label="🏆 SMALL-SIDED GAME" duration="15 min" colour="#10b981"
              editMode={editMode} onSwap={() => handleSwap('smallSided')}
            >
              <span style={{ background: '#064e3b', color: '#34d399', borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                {week.smallSided.format}
              </span>
              <p style={{ margin: '8px 0 0', color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>
                <strong style={{ color: '#6ee7b7' }}>Focus: </strong>{week.smallSided.rules}
              </p>
            </SessionBlock>

            <button
              onClick={onClose}
              style={{
                width: '100%', marginTop: 6, padding: 11, border: 'none',
                borderRadius: 9, background: week.colour, color: '#fff',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}
            >
              ← Back to Plan
            </button>
          </div>
        </div>
      </div>

      {/* Drill picker */}
      {picking && (
        <DrillPicker
          type={picking.type}
          stationIdx={picking.stationIdx}
          accentColour={week.colour}
          onSelect={handlePickerSelect}
          onClose={() => setPicking(null)}
        />
      )}
    </>
  );
}

function SessionBlock({ label, duration, colour, editMode, onSwap, children }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: 10, padding: '14px 15px', marginBottom: 10, borderLeft: `3px solid ${colour}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: colour, letterSpacing: '1px' }}>{label}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#475569', background: '#0f172a', borderRadius: 5, padding: '1px 7px' }}>{duration}</span>
          {editMode && (
            <button
              onClick={onSwap}
              style={{ fontSize: 10, background: '#334155', border: 'none', color: '#94a3b8', borderRadius: 5, padding: '2px 8px', cursor: 'pointer', fontWeight: 700 }}
            >
              ⇄ Swap
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function DrillDiagram({ name }) {
  const DiagComponent = DRILL_DIAGRAM_MAP[name];
  if (!DiagComponent) return null;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 600, letterSpacing: '0.5px' }}>📐 SETUP DIAGRAM</div>
      <DiagComponent />
    </div>
  );
}
