// diagrams.jsx — all SVG pitch diagrams as React components

const PITCH_GREEN = '#166534';
const PITCH_BORDER = '#15803d';

function PitchSVG({ width = 260, height = 160, children }) {
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      style={{ background: PITCH_GREEN, borderRadius: 10, border: `2px solid ${PITCH_BORDER}`, display: 'block', maxWidth: width }}
    >
      <rect x="4" y="4" width={width - 8} height={height - 8} fill="none" stroke={PITCH_BORDER} strokeWidth="1.5" />
      {children}
    </svg>
  );
}

function Cone({ x, y, color = '#f59e0b', size = 7 }) {
  return <polygon points={`${x},${y - size} ${x - size * 0.7},${y + size * 0.4} ${x + size * 0.7},${y + size * 0.4}`} fill={color} stroke="#000" strokeWidth="0.5" />;
}

function Ball({ x, y, r = 6 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" stroke="#222" strokeWidth="1" />
      <circle cx={x} cy={y} r={r * 0.45} fill="#222" opacity="0.15" />
    </g>
  );
}

function Player({ x, y, label = 'P', color = '#3b82f6', size = 11 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={size} fill={color} stroke="#fff" strokeWidth="1.5" />
      <text x={x} y={y + 4} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">{label}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = '#10b981', dashed = false }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len, uy = dy / len, h = 8;
  const ax = x2 - ux * h - uy * h * 0.4, ay = y2 - uy * h + ux * h * 0.4;
  const bx = x2 - ux * h + uy * h * 0.4, by = y2 - uy * h - ux * h * 0.4;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeDasharray={dashed ? '5,4' : undefined} opacity="0.9" />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
    </g>
  );
}

function GoalTop({ x, y, w = 40 }) {
  return <rect x={x - w / 2} y={y} width={w} height={11} fill="none" stroke="#fff" strokeWidth="2" />;
}
function GoalBottom({ x, y, w = 40 }) {
  return <rect x={x - w / 2} y={y - 11} width={w} height={11} fill="none" stroke="#fff" strokeWidth="2" />;
}

function Label({ x, y, text, color = '#86efac', size = 9 }) {
  return <text x={x} y={y} textAnchor="middle" fill={color} fontSize={size}>{text}</text>;
}

// ── Individual diagrams ──────────────────────────────────────────────

export function DiagBallTag() {
  return (
    <PitchSVG width={240} height={160}>
      {[40, 80, 120, 160, 200].map(x => <Cone key={x + 't'} x={x} y={20} />)}
      {[40, 80, 120, 160, 200].map(x => <Cone key={x + 'b'} x={x} y={140} />)}
      {[20, 60, 100, 140, 180, 220].map((x, i) => (
        <g key={i}>
          <Player x={x} y={[60, 90, 75, 100, 65, 85][i]} color={i % 2 ? '#ef4444' : '#3b82f6'} />
          <Ball x={x + 8} y={[60, 90, 75, 100, 65, 85][i] + 12} r={5} />
        </g>
      ))}
      <Label x={120} y={155} text="Every player has a ball — free movement" />
    </PitchSVG>
  );
}

export function DiagSoleRolls() {
  return (
    <PitchSVG width={240} height={140}>
      <Player x={60} y={70} label="P1" color="#3b82f6" />
      <Ball x={90} y={70} r={6} />
      <Arrow x1={90} y1={70} x2={150} y2={70} />
      <Player x={180} y={70} label="P2" color="#ef4444" />
      <line x1={30} y1={50} x2={30} y2={90} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1={210} y1={50} x2={210} y2={90} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
      <Label x={30} y={45} text="Start" color="#fbbf24" size={8} />
      <Label x={210} y={45} text="End" color="#fbbf24" size={8} />
      <Label x={120} y={108} text="5m apart · sole-roll across" />
    </PitchSVG>
  );
}

export function DiagConeSlalom() {
  return (
    <PitchSVG width={260} height={140}>
      {[50, 80, 110, 140, 170].map(x => <Cone key={x} x={x} y={70} />)}
      <Player x={25} y={70} label="P" />
      <Ball x={35} y={70} r={5} />
      <path d="M40,70 Q65,50 80,70 Q95,90 110,70 Q125,50 140,70 Q155,90 170,70 L200,70" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6,3" />
      <Arrow x1={195} y1={70} x2={218} y2={70} />
      <Label x={130} y={120} text="Weave between cones — 1m spacing" />
    </PitchSVG>
  );
}

export function DiagGatePassing() {
  return (
    <PitchSVG width={260} height={160}>
      {[[70, 50], [130, 40], [190, 60], [60, 110], [150, 120], [200, 100]].map(([x, y], i) => (
        <g key={i}><Cone x={x - 8} y={y} /><Cone x={x + 8} y={y} /></g>
      ))}
      <Player x={40} y={80} label="P1" />
      <Ball x={55} y={80} r={5} />
      <Arrow x1={58} y1={78} x2={62} y2={52} />
      <Player x={180} y={140} label="P2" color="#ef4444" />
      <Label x={130} y={150} text="Pass through as many gates as possible" />
    </PitchSVG>
  );
}

export function DiagTrianglePassing() {
  return (
    <PitchSVG width={220} height={170}>
      <Player x={110} y={30} label="P1" />
      <Player x={50} y={130} label="P2" color="#ef4444" />
      <Player x={170} y={130} label="P3" color="#10b981" />
      <Ball x={85} y={85} r={5} />
      <Arrow x1={110} y1={42} x2={60} y2={118} color="#fbbf24" />
      <Arrow x1={58} y1={118} x2={162} y2={118} color="#fbbf24" />
      <Arrow x1={162} y1={118} x2={116} y2={42} color="#fbbf24" dashed />
      <Label x={110} y={158} text="8m per side · rotate direction on command" />
    </PitchSVG>
  );
}

export function DiagShooting() {
  return (
    <PitchSVG width={240} height={170}>
      <GoalTop x={120} y={10} w={50} />
      <Player x={80} y={80} label="GK" color="#7c3aed" size={12} />
      {[[60, 130], [120, 140], [180, 130]].map(([x, y], i) => (
        <g key={i}>
          <Ball x={x} y={y} r={5} />
          <Arrow x1={x} y1={y - 5} x2={[70, 120, 110][i]} y2={[30, 20, 25][i]} color="#ef4444" />
        </g>
      ))}
      {[[60, 140], [120, 150], [180, 140]].map(([x, y], i) => <Player key={i} x={x} y={y} />)}
      <Label x={120} y={162} text="Multiple angles · aim for corners" />
    </PitchSVG>
  );
}

export function DiagJockeying() {
  return (
    <PitchSVG width={200} height={150}>
      <line x1={60} y1={20} x2={60} y2={130} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1={130} y1={20} x2={130} y2={130} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
      <Player x={90} y={110} label="A" />
      <Ball x={90} y={97} r={5} />
      <Arrow x1={90} y1={97} x2={90} y2={50} color="#3b82f6" dashed />
      <Player x={90} y={40} label="D" color="#ef4444" />
      <Arrow x1={90} y1={52} x2={90} y2={65} color="#ef4444" />
      <Label x={100} y={138} text="3m lane · D jockeys, doesn't tackle" />
    </PitchSVG>
  );
}

export function Diag2v1() {
  return (
    <PitchSVG width={220} height={160}>
      <GoalTop x={110} y={10} w={50} />
      <Player x={75} y={90} label="A1" />
      <Player x={145} y={100} label="A2" />
      <Player x={110} y={60} label="D" color="#ef4444" />
      <Ball x={85} y={90} r={5} />
      <Arrow x1={85} y1={88} x2={138} y2={98} />
      <Arrow x1={145} y1={98} x2={120} y2={25} dashed />
      <Label x={110} y={150} text="A1 passes → A2 finishes past 1 defender" />
    </PitchSVG>
  );
}

export function DiagWidePlay() {
  return (
    <PitchSVG width={260} height={170}>
      <GoalTop x={130} y={10} w={50} />
      <Player x={30} y={100} label="W" />
      <Ball x={42} y={100} r={5} />
      <Player x={120} y={80} label="A1" />
      <Player x={150} y={95} label="A2" />
      <Arrow x1={42} y1={98} x2={30} y2={25} dashed />
      <Arrow x1={120} y1={78} x2={115} y2={30} color="#3b82f6" dashed />
      <Arrow x1={150} y1={93} x2={145} y2={30} color="#3b82f6" dashed />
      <line x1={30} y1={20} x2={30} y2={140} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={230} y1={20} x2={230} y2={140} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
      <Label x={130} y={155} text="Wide player delivers · runs to far/near post" />
    </PitchSVG>
  );
}

export function DiagCounterAttack() {
  return (
    <PitchSVG width={260} height={170}>
      <GoalTop x={130} y={10} w={50} />
      <GoalBottom x={130} y={160} w={50} />
      <Player x={130} y={90} label="GK" color="#7c3aed" size={12} />
      <Player x={80} y={130} label="D" color="#ef4444" />
      <Player x={190} y={45} label="F" />
      <Ball x={115} y={90} r={5} />
      <Arrow x1={120} y1={88} x2={185} y2={50} />
      <Label x={130} y={152} text="GK distributes → forward runs in behind" size={8} />
    </PitchSVG>
  );
}

export function DiagRondo() {
  return (
    <PitchSVG width={200} height={190}>
      {[[100, 20], [175, 65], [165, 145], [100, 175], [35, 145], [25, 65]].map(([x, y], i) => (
        <Player key={i} x={x} y={y} size={11} />
      ))}
      <Player x={100} y={100} label="D" color="#ef4444" size={12} />
      <Ball x={140} y={48} r={5} />
      <Arrow x1={140} y1={46} x2={168} y2={66} color="#fbbf24" />
    </PitchSVG>
  );
}

export function DiagFreeKick() {
  return (
    <PitchSVG width={240} height={160}>
      <GoalTop x={120} y={10} w={60} />
      <Player x={90} y={35} label="GK" color="#7c3aed" size={11} />
      {[105, 120, 135].map(x => <Player key={x} x={x} y={75} label="W" color="#ef4444" size={10} />)}
      <Player x={120} y={110} />
      <Ball x={120} y={122} r={5} />
      <Arrow x1={120} y1={118} x2={120} y2={80} dashed />
      <Label x={120} y={150} text="Chip over wall, aim for corners" />
    </PitchSVG>
  );
}

export function DiagCheckRun() {
  return (
    <PitchSVG width={240} height={160}>
      <Player x={160} y={60} label="C" />
      <path d="M160,62 L160,100 L110,80" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,3" />
      <Arrow x1={110} y1={80} x2={108} y2={80} />
      <Cone x={160} y={110} />
      <Player x={60} y={80} label="Co" color="#7c3aed" size={12} />
      <Ball x={80} y={80} r={5} />
      <Arrow x1={82} y1={80} x2={106} y2={80} color="#fbbf24" />
      <Label x={120} y={145} text="Run away → check back sharp to receive" />
    </PitchSVG>
  );
}

export function DiagSmallSided() {
  return (
    <PitchSVG width={280} height={180}>
      <GoalTop x={140} y={8} w={50} />
      <GoalBottom x={140} y={171} w={50} />
      {[[70, 40], [140, 60], [200, 40], [120, 50]].map(([x, y], i) => <Player key={i} x={x} y={y} label="B" color="#ef4444" size={10} />)}
      {[[80, 140], [140, 125], [210, 135], [150, 145]].map(([x, y], i) => <Player key={i} x={x} y={y} label="A" size={10} />)}
      <Ball x={140} y={92} r={6} />
    </PitchSVG>
  );
}

// Map drill names → diagram components
export const DRILL_DIAGRAM_MAP = {
  'Ball Tag': DiagBallTag, 'Traffic Lights': DiagBallTag, 'Compass Dribbling': DiagBallTag,
  'Chase the Tail': DiagBallTag, 'Hot Floor Dribbling': DiagBallTag, 'Relay Races': DiagBallTag,
  'Freestyle Circle': DiagBallTag, 'Numbers Dribbling': DiagBallTag, 'Team Chase the Tail': DiagBallTag,
  'Box-to-Box Sprint': DiagBallTag, 'Shadow Running': DiagJockeying,
  'Loud Passing Circle': DiagTrianglePassing, 'Partner Passing On-the-Move': DiagGatePassing,
  'Circle Keep-Away (Multi)': DiagRondo, 'Shooting Gallery Queue': DiagShooting,
  'Sole Rolls': DiagSoleRolls, 'Juggling Challenges': DiagBallTag,
  'Stepover Intro': DiagConeSlalom, 'Roll & Drag': DiagConeSlalom,
  'Cone Slalom (Multi-Lane)': DiagConeSlalom, 'The Sticky Dribble': DiagConeSlalom,
  'Knock Out (Big Grid)': DiagBallTag, 'Fast Feet Gates': DiagGatePassing,
  'Mirror Dribbling': DiagJockeying,
  'Gate Passing (Big Grid)': DiagGatePassing, 'Passing Relay (Multi-Team)': DiagGatePassing,
  'Triangle Passing (Multiple)': DiagTrianglePassing,
  'Passing Rondo (3 groups)': DiagRondo,
  'Laces Strike (2 goals)': DiagShooting, 'Shoot on the Move (2 goals)': DiagShooting,
  'Shooting Circuit': DiagShooting,
  'Jockeying Lane (Multi)': DiagJockeying, '1v1 Defending Carousel': DiagJockeying,
  '2v2 Press Drill (Multi)': DiagJockeying,
  'Ghost Runs (Multiple)': Diag2v1, 'Support Runs (Groups of 3)': Diag2v1,
  'Check & Receive (Multi-Queue)': DiagCheckRun,
  'Wide Delivery (2 sides)': DiagWidePlay, 'Arrive to Finish (2 sides)': DiagWidePlay,
  'Counter-Attack Trigger': DiagCounterAttack, 'Corner Delivery (Multi)': DiagWidePlay,
  'Wall Pass Drill (Multi)': DiagTrianglePassing,
  'The Cruyff Turn': DiagConeSlalom, 'The Inside Hook': DiagConeSlalom, 'Turn & Beat': DiagJockeying,
  'Set Position & Ready Stance': DiagBallTag, 'Low Saves': DiagShooting,
  'GK Distribution': DiagCounterAttack,
  'Ground Control': DiagSoleRolls, 'Air Control': DiagSoleRolls,
  'Turn on the Receive': DiagCheckRun, 'Forehead Contact': DiagBallTag,
  'Throw-Head-Catch': DiagBallTag, 'Defensive Heading': DiagBallTag,
  'Name It to Claim It': DiagGatePassing, 'GK Voice Drill': DiagShooting,
  'Pressure Shout': DiagBallTag, 'Corner Delivery': DiagWidePlay,
  'Corner Attack Runs': DiagWidePlay, 'Free Kick Over the Wall': DiagFreeKick,
  'Pass or Go? Freeze Game': Diag2v1, '3-Zone Game': DiagGatePassing, 'Overload Choices': Diag2v1,
  'Trick Library': DiagConeSlalom, 'Street Football Rules': DiagGatePassing,
  'Trick Sequence Course': DiagConeSlalom, 'Ladder Footwork': DiagConeSlalom,
  'Agility Tag': DiagBallTag, 'Box of Doom': DiagBallTag,
  'Spot the Option': Diag2v1, 'Decision Cards': Diag2v1, 'Heads-Up Game': DiagGatePassing,
  'Our Kick-Off Routine': DiagSmallSided, 'Our Corner Play': DiagWidePlay,
  'Values Reflection': DiagBallTag, 'Skills Showcase': DiagBallTag,
  'Favourite Drill': DiagBallTag, 'Coach vs Kids': DiagSmallSided,
  'Player Awards Station': DiagBallTag, 'Dream Goal Game': DiagShooting,
  'Shoot-Out Challenge': DiagShooting, 'Two-Touch Rule Passing': DiagGatePassing,
  'Speed Rondo': DiagRondo, 'Third-Man Runs': Diag2v1, 'Cut Inside & Shoot': DiagJockeying,
  'Combination Finish': Diag2v1, 'Defensive Cover': DiagJockeying, 'Clearance Drill': DiagShooting,
  '2v2 Defensive Pairs': DiagJockeying, 'Win It & Go': DiagCounterAttack,
  '3v3 Transition': DiagCounterAttack, 'Break-Out Passes': DiagCounterAttack,
  'Show Me Something': DiagBallTag, 'Grid Spacing': DiagBallTag,
  'Shape Walk-Through': DiagSmallSided, 'Find the Gaps': DiagGatePassing,
  'Receive & Protect': DiagCheckRun, 'Back to Goal Turns': DiagCheckRun,
  'Cushion Trap': DiagSoleRolls, 'Fast Break Waves': Diag2v1,
  'Closing Down Angles': DiagJockeying, 'Trigger Pressing': DiagJockeying,
  'Wide to Centre': DiagWidePlay, 'Switch of Play': DiagWidePlay, 'Wide Play 3v2': DiagWidePlay,
  'Pressure Races': DiagJockeying, 'Gate Passing': DiagGatePassing,
  'Wall Pass Simulation': DiagTrianglePassing, 'Passing Relay': DiagGatePassing,
  'Triangle Passing': DiagTrianglePassing, 'Laces Strike': DiagShooting,
  'Shoot on the Move': DiagShooting, '1v1 to Shoot': DiagJockeying,
  'Jockeying Lane': DiagJockeying, 'Touch Tackle': DiagJockeying, 'Channel Defence': DiagJockeying,
  'Support Runs': Diag2v1, 'Ghost Runs': Diag2v1, 'Check & Receive': DiagCheckRun,
  'Wide Delivery': DiagWidePlay, 'Arrive to Finish': DiagWidePlay,
  'Double Rondo': DiagRondo, 'Wall Pass Drill': DiagTrianglePassing, 'Overlap Runs': Diag2v1,
  'Pass & Follow': DiagGatePassing, 'Find the Space': DiagBallTag,
};
