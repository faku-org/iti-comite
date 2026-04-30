import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

const base =
  "inline-flex items-center gap-2 font-semibold text-sm tracking-wide transition-all duration-200 cursor-pointer";

const variants = {
  primary:
    "bg-mid hover:bg-mid/80 text-white px-8 py-4",
  secondary:
    "border border-frost/40 text-frost hover:bg-frost/10 px-8 py-4",
  ghost:
    "text-white/60 hover:text-white px-4 py-2",
};

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
