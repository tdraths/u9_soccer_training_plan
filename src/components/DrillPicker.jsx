import { useContext } from 'react';
import { PlayerCountContext } from '../App.jsx';
import { DRILL_LIBRARY } from '../data/data.js';
import { DRILL_DIAGRAM_MAP } from '../lib/diagrams.jsx';

export function DrillPicker({ type, stationIdx, accentColour, onSelect, onClose }) {
  const playerCount = useContext(PlayerCountContext);

  const fits = d => d.minPlayers <= playerCount && (!d.maxPlayers || d.maxPlayers >= playerCount);
  const items =
    type === 'warmup' ? DRILL_LIBRARY.warmups.filter(fits) :
    type === 'smallSided' ? DRILL_LIBRARY.smallSided.filter(fits) :
    DRILL_LIBRARY.stations.filter(fits);

  const labels = {
    warmup: 'SWAP WARM-UP',
    station: `SWAP STATION ${(stationIdx ?? 0) + 1}`,
    smallSided: 'SWAP SMALL-SIDED GAME',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1e293b', borderRadius: '14px 14px 0 0',
          maxWidth: 660, width: '100%', maxHeight: '75vh',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>{labels[type]}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Showing options for {playerCount} players
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#334155', border: 'none', color: '#94a3b8', borderRadius: 6, width: 28, height: 28, fontSize: 13, cursor: 'pointer' }}
          >✕</button>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', padding: '12px 16px 20px', flex: 1 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 30, color: '#475569' }}>
              No drills found for {playerCount} players. Try adjusting the player count.
            </div>
          ) : (
            items.map((item, i) => (
              <PickerItem
                key={i}
                item={item}
                accentColour={accentColour}
                onSelect={() => onSelect(item)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PickerItem({ item, accentColour, onSelect }) {
  const DiagComponent = DRILL_DIAGRAM_MAP[item.name];

  return (
    <div
      onClick={onSelect}
      style={{
        background: '#0f172a', borderRadius: 10, padding: '12px 14px',
        marginBottom: 8, cursor: 'pointer', border: '2px solid transparent',
        transition: 'border-color 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = accentColour}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9' }}>{item.name}</span>
        <div style={{ display: 'flex', gap: 5 }}>
          {item.minPlayers && (
            <span style={{ fontSize: 10, color: '#64748b', background: '#1e293b', borderRadius: 5, padding: '1px 6px' }}>
              min {item.minPlayers}p
            </span>
          )}
          {item.format && (
            <span style={{ fontSize: 10, color: '#10b981', background: '#064e3b', borderRadius: 5, padding: '1px 6px' }}>
              {item.format}
            </span>
          )}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{item.desc}</p>
      {DiagComponent && (
        <div style={{ transform: 'scale(0.75)', transformOrigin: 'top left', height: 110, overflow: 'hidden', marginTop: 4 }}>
          <DiagComponent />
        </div>
      )}
    </div>
  );
}
