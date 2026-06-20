import { useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, ReferenceLine,
} from "recharts";
import { fmtPct } from "../lib/format";

const LINES = [
  { key: "nav_index",       name: "AlphaSeek",        color: "var(--accent-as)",    width: 2.6, dash: null,  z: 5 },
  { key: "qqq_index",       name: "QQQ",              color: "var(--accent-qqq)",   width: 1.6, dash: "4 3", z: 3 },
  { key: "voo_index",       name: "VOO",              color: "var(--accent-voo)",   width: 1.4, dash: "4 3", z: 2 },
  { key: "mag7_index",      name: "Mag7 ETF",         color: "var(--accent-mag7)",  width: 1.6, dash: "2 2", z: 2 },
];

function CustomTooltip({ active, payload, label, hidden }) {
  if (!active || !payload || !payload.length) return null;
  const rows = LINES
    .map((l) => {
      if (hidden[l.key]) return null;
      const p = payload.find((x) => x.dataKey === l.key);
      return p ? { ...l, value: p.value } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);
  if (!rows.length) return null;
  return (
    <div className="tooltip">
      <div className="tooltip-date">{label}</div>
      {rows.map((r) => (
        <div key={r.key} className="tooltip-row" style={{ color: r.color }}>
          {r.name}: {fmtPct(r.value - 100)}
        </div>
      ))}
    </div>
  );
}

// Clickable legend — toggles a series on/off.
function ClickableLegend({ items, hidden, onToggle }) {
  return (
    <div className="legend-row">
      {items.map((l) => {
        const off = !!hidden[l.key];
        return (
          <button
            key={l.key}
            type="button"
            className={`legend-item${off ? " legend-off" : ""}`}
            onClick={() => onToggle(l.key)}
            title={off ? `Show ${l.name}` : `Hide ${l.name}`}
          >
            <span
              className="legend-swatch"
              style={{ background: off ? "transparent" : l.color, borderColor: l.color }}
            />
            <span className="legend-label">{l.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function NavCurveChart({ series }) {
  const [hidden, setHidden] = useState({});
  if (!series || series.length === 0) return null;

  const present = LINES.filter((l) => series[0][l.key] != null);
  const toggle = (key) =>
    setHidden((h) => ({ ...h, [key]: !h[key] }));

  return (
    <div className="chart-card">
      <div className="chart-title">
        <span className="live-badge">● LIVE</span>
        &nbsp;Manager-traded, real capital — cumulative return, indexed to 100 at start
      </div>
      <ClickableLegend items={present} hidden={hidden} onToggle={toggle} />
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={series} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: "var(--fg-muted)", fontSize: 12 }} minTickGap={32} />
          <YAxis
            tick={{ fill: "var(--fg-muted)", fontSize: 12 }}
            domain={["auto", "auto"]}
            tickFormatter={(v) => v.toFixed(0)}
          />
          <ReferenceLine y={100} stroke="var(--grid-strong)" strokeDasharray="4 4" />
          <Tooltip content={<CustomTooltip hidden={hidden} />} />
          {present.map((l) => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              name={l.name}
              stroke={l.color}
              strokeWidth={l.width}
              strokeDasharray={l.dash || undefined}
              dot={false}
              isAnimationActive={false}
              hide={!!hidden[l.key]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
