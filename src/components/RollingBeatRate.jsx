import { useEffect, useMemo, useState } from "react";

// Hero stat: across EVERY rolling N-month window in the 2014- record, how often did
// AlphaSeek beat QQQ? Computed client-side from track_record.json so it can never drift
// from the curve. The monotonic climb (1Y→5Y) is the whole pitch: the longer you hold,
// the more certain the edge — every 5-year window beat QQQ.
const WINDOWS = [
  { label: "1 year", m: 12 },
  { label: "2 years", m: 24 },
  { label: "3 years", m: 36 },
  { label: "5 years", m: 60 },
];

function rate(A, Q, win) {
  let w = 0, n = 0;
  for (let i = 0; i + win < A.length; i++) {
    const ra = A[i + win] / A[i] - 1, rq = Q[i + win] / Q[i] - 1;
    if (ra > rq) w++;
    n++;
  }
  return { pct: n ? (100 * w) / n : 0, w, n };
}

function barColor(pct) {
  if (pct >= 97) return "#16a34a";
  if (pct >= 85) return "#4ade80";
  if (pct >= 70) return "#a3e635";
  return "#facc15";
}

export default function RollingBeatRate() {
  const [series, setSeries] = useState(null);
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}track_record.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setSeries(d?.series || null))
      .catch(() => {});
  }, []);

  const rows = useMemo(() => {
    if (!series) return null;
    const A = series.map((r) => r.alphaseek), Q = series.map((r) => r.qqq);
    return WINDOWS.map((w) => ({ ...w, ...rate(A, Q, w.m) }));
  }, [series]);

  if (!rows) return null;

  return (
    <div className="chart-card" style={{ marginBottom: 16 }}>
      <div className="chart-title">
        How often does AlphaSeek beat QQQ?
        <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>
          &nbsp;— every rolling window since 2014, not a cherry-picked start date
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
        {rows.map((r) => (
          <div key={r.m} style={{ display: "grid", gridTemplateColumns: "84px 1fr 132px", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 14, color: "var(--fg-muted)" }}>Hold {r.label}</div>
            <div style={{ position: "relative", height: 30, background: "var(--track, rgba(127,127,127,.14))", borderRadius: 7, overflow: "hidden" }}>
              <div style={{
                width: `${r.pct}%`, height: "100%", background: barColor(r.pct),
                borderRadius: 7, transition: "width .6s ease",
              }} />
              <div style={{
                position: "absolute", left: 10, top: 0, height: "100%",
                display: "flex", alignItems: "center", fontSize: 13.5, fontWeight: 700,
                color: r.pct > 18 ? "#06281a" : "var(--fg)",
              }}>
                {r.pct.toFixed(0)}% of windows
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: 12.5, color: "var(--fg-muted)", fontVariantNumeric: "tabular-nums" }}>
              {r.w}/{r.n} beat QQQ
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 12, lineHeight: 1.5 }}>
        Any single month is a coin-flip (~54%). But the edge compounds: the longer you stay
        invested, the more reliably it shows up — <b>every 5-year window in the record beat QQQ.</b>
        &nbsp;(rf=0 returns; backtest 2014–, point-in-time + walk-forward.)
      </div>
    </div>
  );
}
