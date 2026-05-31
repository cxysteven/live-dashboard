import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, ReferenceLine,
} from "recharts";
import { fmtPct } from "../lib/format";

const LINES = [
  { key: "nav_index",    name: "AlphaSeek", color: "var(--accent-as)",     width: 2.4, dash: null,  z: 5 },
  { key: "qqq_index",    name: "QQQ",       color: "var(--accent-qqq)",    width: 1.6, dash: "4 3", z: 4 },
  { key: "voo_index",    name: "VOO",       color: "var(--accent-voo)",    width: 1.4, dash: "4 3", z: 3 },
  { key: "csi300_index", name: "CSI 300",   color: "var(--accent-csi)",    width: 1.4, dash: "4 3", z: 2 },
  { key: "n225_index",   name: "Nikkei",    color: "var(--accent-n225)",   width: 1.4, dash: "4 3", z: 1 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  // Sort by value desc so the highest line shows first
  const rows = LINES
    .map((l) => {
      const p = payload.find((x) => x.dataKey === l.key);
      return p ? { ...l, value: p.value } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);
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

export default function NavCurveChart({ series }) {
  if (!series || series.length === 0) return null;
  // Only render lines whose dataKey exists in the first datapoint
  const present = LINES.filter((l) => series[0][l.key] != null);
  return (
    <div className="chart-card">
      <div className="chart-title">Cumulative Return — indexed to 100 at start</div>
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
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: "var(--fg-muted)", fontSize: 13 }} />
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
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
