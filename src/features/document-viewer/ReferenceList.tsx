import { useReferenceStore } from "./ReferenceStore";

export function ReferenceList() {
  const references = useReferenceStore((s) => s.references);

  if (references.length === 0) return null;

  return (
    <div className="dv-reference-list">
      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.1rem",
          fontWeight: 400,
          color: "#1C4D8D",
          borderBottom: "1px solid #BDE8F5",
          paddingBottom: "0.35rem",
          marginBottom: "0.75rem",
          letterSpacing: "-0.01em",
        }}
      >
        Referencias
      </h2>
      <ol style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
        {references.map((ref) => (
          <li
            key={ref.number}
            style={{
              fontSize: "0.8rem",
              color: "#1a1a2e",
              lineHeight: 1.6,
              marginBottom: "0.35rem",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <span style={{ color: "#4988C4", flexShrink: 0 }}>
              [{ref.number}]
            </span>
            <span>
              {ref.label}&nbsp;&mdash;&nbsp;
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  wordBreak: "break-all",
                }}
              >
                {ref.url}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
