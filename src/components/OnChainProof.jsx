import { useEffect, useState } from "react";

// Tamper-proof evidence: each signal/dataset/model file is SHA-256 hashed and timestamped
// into a Bitcoin block via OpenTimestamps. Click "verify" → mempool.space shows the block
// + its timestamp. Nobody (not us) can backdate or alter what's in a mined block.
export default function OnChainProof() {
  const [proof, setProof] = useState(null);
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}proof.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null)).then(setProof).catch(() => {});
  }, []);
  if (!proof || !proof.items?.length) return null;

  const cats = ["Strategy signals", "Evidence index"];
  const byCat = (c) => proof.items.filter((i) => i.category === c);

  return (
    <div className="chart-card" style={{ marginTop: 18 }}>
      <div className="chart-title">
        <span style={{ color: "#f7931a", fontWeight: 700 }}>⛓ On-chain proof</span>
        &nbsp;— every signal SHA-256-hashed into a Bitcoin block. You don't trust us; you verify the chain.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginTop: 10 }}>
        {cats.map((c) => (
          <div key={c}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--fg-muted)", marginBottom: 6 }}>{c}</div>
            {byCat(c).map((it) => (
              <a key={it.label + it.block} href={it.url} target="_blank" rel="noopener noreferrer"
                 className="proof-row"
                 style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "5px 8px", borderRadius: 6, textDecoration: "none",
                          color: "var(--fg)", fontSize: 13.5, gap: 8 }}>
                <span>{it.label}</span>
                <span style={{ color: "#f7931a", fontVariantNumeric: "tabular-nums" }}>
                  block {it.block.toLocaleString()} ↗
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11.5, opacity: 0.6, marginTop: 10 }}>
        Verify yourself: <code>ots verify &lt;file&gt;.ots</code>, or open any block on mempool.space and read its timestamp.
        Each signal is hashed onto Bitcoin <b>before</b> it's acted on — immutable, and you verify the chain, not us.
      </div>
    </div>
  );
}
