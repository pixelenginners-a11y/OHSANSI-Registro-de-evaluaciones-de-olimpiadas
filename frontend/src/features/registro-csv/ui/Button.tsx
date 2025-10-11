import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "accent";
  isLoading?: boolean;
};

export default function Button({ variant="primary", isLoading=false, className="", children, ...rest }: Props) {
  const base = "rounded-lg px-4 py-2 text-sm font-semibold transition md:text-base disabled:opacity-60";
  const styles = {
    primary: "bg-[#003049] text-white hover:opacity-90",
    outline: "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100",
    accent:  "bg-[#F77F00] text-white hover:opacity-90",
  }[variant];

  return (
    <button className={`${base} ${styles} ${className}`} disabled={isLoading || rest.disabled} {...rest}>
      {isLoading ? "Procesando..." : children}
    </button>
  );
}
