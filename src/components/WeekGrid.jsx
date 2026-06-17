export function WeekGrid({ weeks, onSelect }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 10,
    }}>
      {weeks.map(w => (
        <WeekCard key={`r${w.rotation}-w${w.week}`} week={w} onClick={() => onSelect(w)} />
      ))}
    </div>
  );
}

function WeekCard({ week: w, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#1e293b',
        borderRadius: 10,
        borderLeft: `4px solid ${w.colour}`,
        padding: '14px',
        cursor: 'pointer',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#263548'}
      onMouseLeave={e => e.currentTarget.style.background = '#1e293b'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <span style={{
          background: w.colour, color: '#fff', borderRadius: 5,
          padding: '2px 7px', fontSize: 10, fontWeight: 700,
        }}>
          WEEK {w.week}
        </span>
        <span style={{ fontSize: 14, color: '#475569' }}>›</span>
      </div>
      <h3 style={{ margin: '0 0 5px', fontSize: 13, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>
        {w.theme}
      </h3>
      <div style={{ fontSize: 10, color: '#475569' }}>
        {w.stations.map(s => s.name).join(' · ')}
      </div>
    </div>
  );
}
