import { useEffect, useState } from "react";
import NavCurveChart from "./components/NavCurveChart";
import DrawdownChart from "./components/DrawdownChart";
import StatsRow from "./components/StatsRow";
import "./App.css";

export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

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

      <StatsRow stats={stats} />

      <NavCurveChart series={series} />

      <DrawdownChart series={series} />
    </div>
  );
}
