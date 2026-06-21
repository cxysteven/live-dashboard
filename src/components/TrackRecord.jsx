import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, ReferenceLine,
} from "recharts";
import { fmtPct, fmtPp, fmtNum, signColor } from "../lib/format";

// Production V3 backtest (canonical: +2244% / CAGR 29.4% over 2014-2026, ground truth) vs QQQ.
// Pick any trailing window or custom range to inspect the track record.
const PRESETS = [
  { label: "1Y", months: 12 },
  { label: "2Y", months: 24 },
  { label: "3Y", months: 36 },
  { label: "5Y", months: 60 },
  { label: "All", months: 0 },
];

function annSharpe(rets) {
  if (rets.length < 2) return 0;
  const m = rets.reduce((a, b) => a + b, 0) / rets.length;
  const sd = Math.sqrt(rets.reduce((a, b) => a + (b - m) ** 2, 0) / (rets.length - 1));
  return sd > 0 ? (m / sd) * Math.sqrt(12) : 0;
}
function maxDD(idx) {
  let peak = -Infinity, mdd = 0;
  for (const v of idx) { peak = Math.max(peak, v); mdd = Math.min(mdd, v / peak - 1); }
  return mdd * 100;
}

function Card({ label, value, color, sub }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color: color || "var(--fg)" }}>{value}</div>
      {sub ? <div className="kpi-sub">{sub}</div> : null}
    </div>
  );
}

export default function TrackRecord() {
  const [raw, setRaw] = useState(null);
  const [err, setErr] = useState(null);
  const [preset, setPreset] = useState(0);   // default: All (full 2014- record, most representative)
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}track_record.json`, { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setRaw).catch((e) => setErr(e.message));
  }, []);

  const view = useMemo(() => {
    if (!raw) return null;
    const all = raw.series;
    let slice;
    if (customStart && customEnd) {
      slice = all.filter((r) => r.date >= customStart && r.date <= customEnd);
    } else if (preset > 0) {
      slice = all.slice(Math.max(0, all.length - preset - 1)); // +1 base point for the window return
    } else {
      slice = all;
    }
    if (slice.length < 2) return null;
    const a0 = slice[0].alphaseek, q0 = slice[0].qqq;
    const series = slice.map((r) => ({
      date: r.date,
      alphaseek: +(r.alphaseek / a0 * 100).toFixed(2),
      qqq: +(r.qqq / q0 * 100).toFixed(2),
    }));
    const aIdx = series.map((s) => s.alphaseek), qIdx = series.map((s) => s.qqq);
    const aRet = aIdx.slice(1).map((v, i) => v / aIdx[i] - 1);
    const qRet = qIdx.slice(1).map((v, i) => v / qIdx[i] - 1);
    const n = series.length - 1;
    const cagr = (x) => (Math.pow(x[x.length - 1] / 100, 12 / n) - 1) * 100;
    const winMonths = aRet.filter((r, i) => r > qRet[i]).length;
    return {
      series, n,
      aTot: aIdx[aIdx.length - 1] - 100, qTot: qIdx[qIdx.length - 1] - 100,
      aCagr: cagr(aIdx), qCagr: cagr(qIdx),
      aSharpe: annSharpe(aRet), qSharpe: annSharpe(qRet),
      aMdd: maxDD(aIdx), qMdd: maxDD(qIdx),
      winPct: (winMonths / aRet.length) * 100,
      span: `${series[0].date} → ${series[series.length - 1].date}`,
    };
  }, [raw, preset, customStart, customEnd]);

  if (err) return <div className="state state-error">Failed to load track record: {err}</div>;
  if (!raw) return <div className="state">Loading…</div>;
  const months = raw.series.map((r) => r.date);

  return (
    <>
      <div className="chart-title" style={{ marginBottom: 10 }}>
        AlphaSeek vs QQQ — pick any window. Production model, indexed to 100 at window start.
      </div>
      <div className="legend-row" style={{ marginBottom: 8 }}>
        {PRESETS.map((p) => (
          <button key={p.label} type="button"
            className={`legend-item${preset === p.months && !customStart ? "" : " legend-off"}`}
            onClick={() => { setPreset(p.months); setCustomStart(""); setCustomEnd(""); }}>
            <span className="legend-label">{p.label}</span>
          </button>
        ))}
        <span style={{ opacity: 0.6, fontSize: 13, alignSelf: "center", margin: "0 6px" }}>or</span>
        <select value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="tr-select">
          <option value="">start…</option>
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="tr-select">
          <option value="">end…</option>
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {view ? (
        <>
          <div className="stats-row">
            <Card label="AlphaSeek Return" value={fmtPct(view.aTot)} color={signColor(view.aTot)}
              sub={`CAGR ${fmtNum(view.aCagr, 1)}% · ${view.span}`} />
            <Card label="QQQ Return" value={fmtPct(view.qTot)} color={signColor(view.qTot)}
              sub={`CAGR ${fmtNum(view.qCagr, 1)}%`} />
            <Card label="Alpha" value={fmtPp(view.aTot - view.qTot)} color={signColor(view.aTot - view.qTot)}
              sub={`Sharpe ${fmtNum(view.aSharpe, 2)} vs ${fmtNum(view.qSharpe, 2)}`} />
            <Card label="Months Beat QQQ" value={`${fmtNum(view.winPct, 0)}%`}
              sub={`MDD ${fmtNum(view.aMdd, 0)}% vs ${fmtNum(view.qMdd, 0)}%`} />
          </div>
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={view.series} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "var(--fg-muted)", fontSize: 12 }} minTickGap={40} />
                <YAxis tick={{ fill: "var(--fg-muted)", fontSize: 12 }} domain={["auto", "auto"]}
                  tickFormatter={(v) => v.toFixed(0)} />
                <ReferenceLine y={100} stroke="var(--grid-strong)" strokeDasharray="4 4" />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--grid)" }}
                  formatter={(v, n) => [`${fmtPct(v - 100)}`, n]} />
                <Line type="monotone" dataKey="alphaseek" name="AlphaSeek" stroke="var(--accent-as)"
                  strokeWidth={2.4} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="qqq" name="QQQ" stroke="var(--accent-qqq)"
                  strokeWidth={1.6} strokeDasharray="4 3" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-title" style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
            Production V3 backtest (walk-forward, after 5bps cost), monthly. Live tracking since 2026-02.
          </div>
        </>
      ) : <div className="state">Pick a wider window.</div>}
    </>
  );
}
