import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid,
} from "recharts";
import { fmtPct } from "../lib/format";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const dd = payload[0]?.value;
  return (
    <div className="tooltip">
      <div className="tooltip-date">{label}</div>
      <div className="tooltip-row" style={{ color: "var(--accent-neg)" }}>
        Drawdown: {fmtPct(dd)}
      </div>
    </div>
  );
}

export default function DrawdownChart({ series }) {
  if (!series || series.length === 0) return null;
  return (
    <div className="chart-card">
      <div className="chart-title">Drawdown (% from running peak)</div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={series} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} minTickGap={32} />
          <YAxis
            tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
            tickFormatter={(v) => `${v.toFixed(0)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="drawdown_pct"
            stroke="var(--accent-neg)"
            fill="var(--accent-neg)"
            fillOpacity={0.25}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
