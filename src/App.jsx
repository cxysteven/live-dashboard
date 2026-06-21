import { useEffect, useState } from "react";
import NavCurveChart from "./components/NavCurveChart";
import BacktestLiveChart from "./components/BacktestLiveChart";
import StatsRow from "./components/StatsRow";
import ThemeRotation from "./components/ThemeRotation";
import TrackRecord from "./components/TrackRecord";
import RollingBeatRate from "./components/RollingBeatRate";
import OnChainProof from "./components/OnChainProof";
import "./App.css";

export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [view, setView] = useState("live");   // "live" | "track"

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <div className="state state-error">Failed to load data: {err}</div>;
  if (!data) return <div className="state">Loading…</div>;

  const { stats, series, live_start_date, as_of } = data;

  return (
    <div className="page">
      <header className="hdr">
        <h1>AlphaSeek</h1>
        <div className="hdr-tagline">Hunting alpha, one tick at a time.</div>
        <div className="hdr-sub">
          {live_start_date} → {as_of} &nbsp;·&nbsp; {stats.days_live} trading days
          {data._sample ? <span className="badge"> sample data</span> : null}
        </div>
      </header>

      <div className="legend-row" style={{ marginBottom: 14 }}>
        <button type="button" className={`legend-item${view === "live" ? "" : " legend-off"}`}
          onClick={() => setView("live")}><span className="legend-label">● Live (2026)</span></button>
        <button type="button" className={`legend-item${view === "track" ? "" : " legend-off"}`}
          onClick={() => setView("track")}><span className="legend-label">Track Record (2014–)</span></button>
      </div>

      {view === "live" ? (
        <>
          <StatsRow stats={stats} />
          <NavCurveChart series={series} />
          {data.combined ? (
            <BacktestLiveChart combined={data.combined} meta={data.combined_span} />
          ) : null}
          <ThemeRotation />
          <OnChainProof />
        </>
      ) : (
        <>
          <RollingBeatRate />
          <TrackRecord />
        </>
      )}
    </div>
  );
}
