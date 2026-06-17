import { createContext, useState } from 'react';
import { BASE_WEEKS, ROTATION_COLOURS } from './data/data.js';
import { useStorage } from './hooks/useStorage.js';
import { WeekGrid } from './components/WeekGrid.jsx';
import { SessionModal } from './components/SessionModal.jsx';

// Context so DrillPicker can read playerCount without prop drilling
export const PlayerCountContext = createContext(16);

const STORAGE_KEY = 'weekData_v1';

export default function App() {
  const [rotation, setRotation] = useState(1);
  const [playerCount, setPlayerCount] = useState(16);
  const [selectedWeek, setSelectedWeek] = useState(null);

  // weekData persists to localStorage automatically
  const [weekData, setWeekData, resetWeekData] = useStorage(
    STORAGE_KEY,
    BASE_WEEKS.map(w => ({ ...w, stations: w.stations.map(s => ({ ...s })) }))
  );

  const rc = ROTATION_COLOURS[rotation];
  const visibleWeeks = weekData.filter(w => w.rotation === rotation);

  const handleSelectWeek = (w) => {
    // Always pull fresh from weekData so edits are visible
    const fresh = weekData.find(x => x.rotation === w.rotation && x.week === w.week);
    setSelectedWeek(fresh || w);
  };

  const handleUpdateWeek = (updated) => {
    const next = weekData.map(w =>
      w.rotation === updated.rotation && w.week === updated.week ? updated : w
    );
    setWeekData(next);
    setSelectedWeek(updated);
  };

  const handleReset = () => {
    if (window.confirm('Reset all customisations back to the original plan?')) {
      resetWeekData();
      setSelectedWeek(null);
    }
  };

  return (
    <PlayerCountContext.Provider value={playerCount}>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#0f172a', minHeight: '100vh', color: '#f1f5f9' }}>

        {/* Header */}
        <div style={{ background: rc.bg, borderBottom: `3px solid ${rc.accent}`, padding: '20px 16px 16px' }}>
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>⚽</span>
              <div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>
                  Under 9 Soccer Coaching Plan
                </h1>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: rc.light, opacity: 0.8 }}>
                  32 Weeks · 1 Hour Sessions · 14–24 Players · Your edits save automatically
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {[1, 2].map(r => (
                <button
                  key={r}
                  onClick={() => setRotation(r)}
                  style={{
                    padding: '7px 18px', borderRadius: 8, border: '2px solid',
                    borderColor: rotation === r ? rc.accent : 'rgba(255,255,255,0.2)',
                    background: rotation === r ? rc.accent : 'transparent',
                    color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  }}
                >
                  Rotation {r}
                </button>
              ))}

              {/* Player count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 12px' }}>
                <label style={{ fontSize: 12, color: rc.light }}>👦 Players today:</label>
                <select
                  value={playerCount}
                  onChange={e => setPlayerCount(Number(e.target.value))}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', outline: 'none' }}
                >
                  {[14,15,16,17,18,19,20,21,22,23,24].map(n => (
                    <option key={n} value={n} style={{ background: '#1e293b' }}>{n} players</option>
                  ))}
                </select>
              </div>

              {/* Reset */}
              <button
                onClick={handleReset}
                style={{
                  marginLeft: 'auto', padding: '6px 12px', borderRadius: 7,
                  border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
                  color: 'rgba(255,255,255,0.5)', fontSize: 11, cursor: 'pointer',
                }}
              >
                ↺ Reset plan
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '20px 14px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { icon: '🌡️', label: 'Warm-Up: 8 min' },
              { icon: '🔵', label: '3 Stations × 8 min' },
              { icon: '🏆', label: 'Game: 15 min' },
            ].map(item => (
              <div key={item.label} style={{ background: '#1e293b', borderRadius: 8, padding: '5px 12px', fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                {item.icon} {item.label}
              </div>
            ))}
            <div style={{ marginLeft: 'auto', background: '#1e293b', borderRadius: 8, padding: '5px 12px', fontSize: 11, color: '#64748b' }}>
              ✏️ Tap any week · edits saved to this device
            </div>
          </div>

          <WeekGrid weeks={visibleWeeks} onSelect={handleSelectWeek} />
        </div>

        {/* Modal */}
        {selectedWeek && (
          <SessionModal
            week={selectedWeek}
            onClose={() => setSelectedWeek(null)}
            onUpdate={handleUpdateWeek}
          />
        )}
      </div>
    </PlayerCountContext.Provider>
  );
}
