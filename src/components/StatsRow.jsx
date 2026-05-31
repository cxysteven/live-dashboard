import { fmtPct, fmtPp, fmtNum, signColor } from "../lib/format";

function Card({ label, value, color, sub }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color: color || "var(--fg)" }}>{value}</div>
      {sub ? <div className="kpi-sub">{sub}</div> : null}
    </div>
  );
}

export default function StatsRow({ stats }) {
  if (!stats) return null;
  const benchmarks = [
    { label: "QQQ", ret: stats.qqq_return_pct },
    { label: "VOO", ret: stats.voo_return_pct },
    { label: "CSI300", ret: stats.csi300_return_pct },
    { label: "N225", ret: stats.n225_return_pct },
  ].filter((b) => b.ret != null);

  const best = benchmarks.reduce((a, b) => (a.ret < b.ret ? a : b), benchmarks[0]);
  const worst = benchmarks.reduce((a, b) => (a.ret > b.ret ? a : b), benchmarks[0]);

  return (
    <>
      <div className="stats-row">
        <Card
          label="Total Return"
          value={fmtPct(stats.total_return_pct)}
          color={signColor(stats.total_return_pct)}
          sub={`${stats.days_live} days · win ${fmtNum(stats.win_days_pct, 0)}%`}
        />
        <Card
          label="Sharpe"
          value={fmtNum(stats.sharpe_annualized, 2)}
          sub="annualized"
        />
        <Card
          label="Best Δ"
          value={fmtPp(stats.total_return_pct - best.ret)}
          color={signColor(stats.total_return_pct - best.ret)}
          sub={`vs ${best.label}`}
        />
        <Card
          label="Toughest Δ"
          value={fmtPp(stats.total_return_pct - worst.ret)}
          color={signColor(stats.total_return_pct - worst.ret)}
          sub={`vs ${worst.label}`}
        />
      </div>
      <div className="bench-row">
        {benchmarks.map((b) => (
          <div key={b.label} className="bench-pill">
            <span className="bench-label">{b.label}</span>
            <span className="bench-val" style={{ color: signColor(b.ret) }}>
              {fmtPct(b.ret)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
