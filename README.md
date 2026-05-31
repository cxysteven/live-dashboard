# V3 Live Tracking — Frontend

React + Vite + Recharts single-page dashboard. Consumes static
`public/data.json` (generated daily by
[`scripts/v3_live_dashboard/ingest_flex_query.py`](../scripts/v3_live_dashboard/README.md)).

## Local dev

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve dist/ at http://localhost:4173
```

## Deploy (Vercel)

Vercel auto-deploys on every `git push origin main`:

- Root Directory: `my-chart`
- Build Command: `npm run build`
- Output Directory: `dist`

## Architecture

```
public/data.json          ← single data source (scrubbed, anonymized)
src/App.jsx               ← fetches data.json, renders page
src/components/
  ├─ StatsRow.jsx         ← 4 KPI cards (return / alpha / Sharpe / MDD)
  ├─ NavCurveChart.jsx    ← V3 vs QQQ indexed line chart
  └─ DrawdownChart.jsx    ← drawdown area chart
src/lib/format.js         ← pct / pp / num formatters
```

## Privacy invariant

`data.json` must contain ZERO of: $ amounts, tickers, position counts,
account IDs. The ingest script enforces this with a keyword blacklist
audit on every run. The dashboard renders only what's in the JSON, so
if the JSON is clean, the public site is clean.
