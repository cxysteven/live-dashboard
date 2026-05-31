// Lightweight formatting helpers — no external deps.

export const fmtPct = (v, digits = 2) => {
  if (v == null || isNaN(v)) return "—";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(digits)}%`;
};

export const fmtPp = (v, digits = 2) => {
  if (v == null || isNaN(v)) return "—";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(digits)}pp`;
};

export const fmtNum = (v, digits = 2) => {
  if (v == null || isNaN(v)) return "—";
  return v.toFixed(digits);
};

export const fmtDate = (iso) => {
  if (!iso) return "—";
  return iso; // YYYY-MM-DD is already short + ISO
};

export const signColor = (v) => {
  if (v == null || isNaN(v)) return "var(--fg-muted)";
  if (v > 0) return "var(--fg-pos)";
  if (v < 0) return "var(--fg-neg)";
  return "var(--fg)";
};
