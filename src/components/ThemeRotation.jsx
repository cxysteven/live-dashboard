// Anonymized monthly theme rotation — sector narrative only, NO tickers / weights.
// Demonstrates the strategy actively rotates across themes month to month.
const THEMES = [
  { month: "Feb", theme: "Semi equipment & storage" },
  { month: "Mar", theme: "Defensive tilt" },
  { month: "Apr", theme: "Mega-cap tech" },
  { month: "May", theme: "Semiconductors" },
  { month: "Jun", theme: "Cybersecurity + semis" },
];

export default function ThemeRotation() {
  return (
    <div className="theme-block">
      <div className="theme-title">Theme rotation (live)</div>
      <div className="theme-track">
        {THEMES.map((t, i) => (
          <div key={t.month} className="theme-step">
            <div className="theme-month">{t.month}</div>
            <div className="theme-name">{t.theme}</div>
            {i < THEMES.length - 1 ? <div className="theme-arrow">→</div> : null}
          </div>
        ))}
      </div>
      <div className="theme-cap">
        Holdings rotate monthly across sectors — tickers &amp; weights kept private.
      </div>
    </div>
  );
}
