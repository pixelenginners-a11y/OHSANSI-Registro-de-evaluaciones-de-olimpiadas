import React from "react";
export default function Card({ className="", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl border border-neutral-200 bg-white ${className}`} {...props} />;
}
