# AlphaSeek — Live Dashboard (frontend)

React + Vite + Recharts single-page site. It renders **only** a static, pre-scrubbed
`public/data.json` (plus `track_record.json` and `proof.json`). All numbers are produced
off-platform by a private pipeline and anonymized before they land here; this repo
contains no strategy code, no datasets, and no raw broker data.

## Local dev

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve dist/
```

## Deploy

Vercel auto-deploys on every `git push`. Build `npm run build`, output `dist/`.

## What's in this repo (and what's deliberately not)

```
public/data.json          ← live curve, indexed to 100 (no $, no tickers)
public/track_record.json  ← 2014– backtest curve, indexed (no $, no tickers)
public/proof.json         ← labels + Bitcoin block numbers only (no file content)
src/                       ← React components (charts, stats, on-chain panel)
```

Not here, by design: the strategy implementation, any training or constituent data,
broker exports, source file names, or on-chain proofs of those — all of it stays in a
separate **private** repository and is only disclosed to a counterparty during due diligence.

## Privacy invariant

Every published JSON must contain ZERO of: `$` amounts, tickers, position counts,
account IDs, strategy codename, or source file names. The upstream generator enforces
this with a keyword blacklist on every run. The site renders only what's in the JSON, so
if the JSON is clean, the public site is clean.
