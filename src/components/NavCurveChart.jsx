import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, ReferenceLine,
} from "recharts";
import { fmtPct } from "../lib/format";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const nav = payload.find((p) => p.dataKey === "nav_index")?.value;
  const qqq = payload.find((p) => p.dataKey === "qqq_index")?.value;
  return (
    <div className="tooltip">
      <div className="tooltip-date">{label}</div>
      {nav != null && (
        <div className="tooltip-row" style={{ color: "var(--accent-v3)" }}>
          V3 Live: {fmtPct(nav - 100)}
        </div>
      )}
      {qqq != null && (
        <div className="tooltip-row" style={{ color: "var(--accent-qqq)" }}>
          QQQ: {fmtPct(qqq - 100)}
        </div>
      )}
      {nav != null && qqq != null && (
        <div className="tooltip-row" style={{ color: "var(--fg-muted)" }}>
          Δ: {fmtPct(nav - qqq)}
        </div>
      )}
    </div>
  );
}

export default function NavCurveChart({ series }) {
  if (!series || series.length === 0) return null;
  return (
    <div className="chart-card">
      <div className="chart-title">Cumulative Return — Live vs QQQ (indexed to 100)</div>
      <ResponsiveContainer width="100%" height={380}>
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
          <Line
            type="monotone"
            dataKey="nav_index"
            name="V3 Live"
            stroke="var(--accent-v3)"
            strokeWidth={2.2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="qqq_index"
            name="QQQ"
            stroke="var(--accent-qqq)"
            strokeWidth={1.6}
            strokeDasharray="4 3"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
