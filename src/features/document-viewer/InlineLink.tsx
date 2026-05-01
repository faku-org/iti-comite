import { useEffect, useRef } from "react";
import { useReferenceStore } from "./ReferenceStore";

interface InlineLinkProps {
  label: string;
  url: string;
}

export function InlineLink({ label, url }: InlineLinkProps) {
  const register = useReferenceStore((s) => s.register);
  const numberRef = useRef<number | null>(null);

  if (numberRef.current === null) {
    numberRef.current = register(label, url);
  }

  useEffect(() => {
    numberRef.current = register(label, url);
  }, [label, url, register]);

  const n = numberRef.current;

  return (
    <span className="dv-inline-link" style={{ display: "inline" }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={url}
        style={{ color: "inherit", textDecoration: "underline" }}
      >
        {label}
        <svg
          aria-hidden="true"
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          style={{ display: "inline", marginLeft: 2, verticalAlign: "middle" }}
        >
          <path
            d="M3.5 3H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8.5M7 2h3m0 0v3m0-3L5.5 6.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
      <sup style={{ color: "#4988C4", fontSize: "0.7em", marginLeft: 1 }}>
        [{n}]
      </sup>
    </span>
  );
}
