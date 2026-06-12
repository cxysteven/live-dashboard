import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid,
} from "recharts";

function Tip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const get = (k) => {
    const p = payload.find((x) => x.dataKey === k && x.value != null);
    return p ? p.value : null;
  };
  const mult = (x) => (x == null ? "—" : `${(x / 100).toFixed(1)}×`);
  return (
    <div className="tooltip">
      <div className="tooltip-date">{label}</div>
      <div className="tooltip-row" style={{ color: "var(--accent-as)" }}>AlphaSeek: {mult(get("as"))}</div>
      <div className="tooltip-row" style={{ color: "var(--accent-qqq)" }}>QQQ: {mult(get("qqq"))}</div>
    </div>
  );
}

export default function BacktestLiveChart({ combined, meta }) {
  if (!combined || combined.length === 0) return null;
  const rows = combined.filter((d) => d.phase === "hist");
  if (rows.length === 0) return null;

  return (
    <div className="chart-card">
      <div className="chart-title">Growth of 1 — 10-year backtest (log scale)</div>
      <div className="legend-row">
        <span className="legend-item" style={{ cursor: "default" }}>
          <span className="legend-swatch" style={{ background: "var(--accent-as)", borderColor: "var(--accent-as)" }} />
          <span className="legend-label">AlphaSeek</span>
        </span>
        <span className="legend-item" style={{ cursor: "default" }}>
          <span className="legend-swatch" style={{ background: "var(--accent-qqq)", borderColor: "var(--accent-qqq)" }} />
          <span className="legend-label">QQQ</span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: "var(--fg-muted)", fontSize: 12 }} minTickGap={48} />
          <YAxis
            scale="log"
            domain={["auto", "auto"]}
            ticks={[100, 200, 400, 800, 1600]}
            tick={{ fill: "var(--fg-muted)", fontSize: 12 }}
            tickFormatter={(v) => `${(v / 100).toFixed(0)}×`}
          />
          <Tooltip content={<Tip />} />
          <Line dataKey="qqq" name="QQQ" stroke="var(--accent-qqq)" strokeWidth={1.6} strokeDasharray="4 3" dot={false} isAnimationActive={false} />
          <Line dataKey="as" name="AlphaSeek" stroke="var(--accent-as)" strokeWidth={2.6} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="chart-disclaimer">
        {meta?.hist_start}–{meta?.hist_end} walk-forward simulation (no live capital, costs included).
        Live performance shown above. Past performance does not guarantee future results.
      </div>
    </div>
  );
}
