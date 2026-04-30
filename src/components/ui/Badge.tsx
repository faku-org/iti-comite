interface BadgeProps {
  label: string;
  variant?: "default" | "pinned";
}

export default function Badge({ label, variant = "default" }: BadgeProps) {
  const styles =
    variant === "pinned"
      ? "bg-frost/15 text-frost border border-frost/30"
      : "bg-mid/15 text-mid border border-mid/25";

  return (
    <span
      className={`inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 ${styles}`}
    >
      {label}
    </span>
  );
}
