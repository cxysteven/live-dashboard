import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, ReferenceLine,
} from "recharts";

// Splits the combined backtest+live series into dashed (backtest) and solid (live)
// segments so a single chart shows "10yr walk-forward → live" as one continuous curve.
function buildRows(combined) {
  const rows = combined.map((d) => {
    const bt = d.phase === "hist";
    return {
      date: d.date,
      as_bt: bt ? d.as : null,
      qqq_bt: bt ? d.qqq : null,
      as_live: bt ? null : d.as,
      qqq_live: bt ? null : d.qqq,
    };
  });
  // stitch the seam: last backtest point also seeds the live keys so solid joins dashed
  let lastBt = -1;
  for (let i = 0; i < rows.length; i++) if (rows[i].as_bt != null) lastBt = i;
  if (lastBt >= 0) {
    rows[lastBt].as_live = rows[lastBt].as_bt;
    rows[lastBt].qqq_live = rows[lastBt].qqq_bt;
  }
  return rows;
}

function Tip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const get = (k) => {
    const p = payload.find((x) => x.dataKey === k && x.value != null);
    return p ? p.value : null;
  };
  const v3 = get("as_live") ?? get("as_bt");
  const qqq = get("qqq_live") ?? get("qqq_bt");
  const mult = (x) => (x == null ? "—" : `${(x / 100).toFixed(1)}×`);
  return (
    <div className="tooltip">
      <div className="tooltip-date">{label}</div>
      <div className="tooltip-row" style={{ color: "var(--accent-as)" }}>AlphaSeek: {mult(v3)}</div>
      <div className="tooltip-row" style={{ color: "var(--accent-qqq)" }}>QQQ: {mult(qqq)}</div>
    </div>
  );
}

export default function BacktestLiveChart({ combined, meta }) {
  if (!combined || combined.length === 0) return null;
  const rows = buildRows(combined);
  const liveStart = meta?.live_start || combined.find((d) => d.phase === "live")?.date;

  return (
    <div className="chart-card">
      <div className="chart-title">
        Growth of 1 — 10-year walk-forward backtest → live (log scale)
      </div>
      <div className="legend-row">
        <span className="legend-item" style={{ cursor: "default" }}>
          <span className="legend-swatch" style={{ background: "var(--accent-as)", borderColor: "var(--accent-as)" }} />
          <span className="legend-label">AlphaSeek</span>
        </span>
        <span className="legend-item" style={{ cursor: "default" }}>
          <span className="legend-swatch" style={{ background: "var(--accent-qqq)", borderColor: "var(--accent-qqq)" }} />
          <span className="legend-label">QQQ</span>
        </span>
        <span className="legend-item" style={{ cursor: "default" }}>
          <span className="legend-label" style={{ color: "var(--fg-muted)" }}>┄ backtest&nbsp;&nbsp;━ live</span>
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
          {liveStart ? (
            <ReferenceLine
              x={liveStart}
              stroke="var(--accent-as)"
              strokeDasharray="3 3"
              label={{ value: "live →", position: "insideTopLeft", fill: "var(--accent-as)", fontSize: 11 }}
            />
          ) : null}
          <Tooltip content={<Tip />} />
          {/* QQQ behind */}
          <Line dataKey="qqq_bt" stroke="var(--accent-qqq)" strokeWidth={1.4} strokeDasharray="4 3" dot={false} isAnimationActive={false} connectNulls={false} />
          <Line dataKey="qqq_live" stroke="var(--accent-qqq)" strokeWidth={1.8} dot={false} isAnimationActive={false} connectNulls={false} />
          {/* AlphaSeek front */}
          <Line dataKey="as_bt" stroke="var(--accent-as)" strokeWidth={2} strokeDasharray="5 3" dot={false} isAnimationActive={false} connectNulls={false} />
          <Line dataKey="as_live" stroke="var(--accent-as)" strokeWidth={2.8} dot={false} isAnimationActive={false} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="chart-disclaimer">
        Backtest {meta?.hist_start}–{meta?.hist_end}: monthly walk-forward simulation, no live
        capital, costs included. Live since {liveStart}: real capital, time-weighted. Past performance
        does not guarantee future results.
      </div>
    </div>
  );
}
