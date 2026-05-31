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
  return (
    <div className="stats-row">
      <Card
        label="Total Return"
        value={fmtPct(stats.total_return_pct)}
        color={signColor(stats.total_return_pct)}
      />
      <Card
        label="Alpha vs QQQ"
        value={fmtPp(stats.alpha_pp)}
        color={signColor(stats.alpha_pp)}
      />
      <Card
        label="Sharpe"
        value={fmtNum(stats.sharpe_annualized, 2)}
      />
      <Card
        label="Max Drawdown"
        value={fmtPct(stats.mdd_pct)}
        color={signColor(stats.mdd_pct)}
      />
    </div>
  );
}
