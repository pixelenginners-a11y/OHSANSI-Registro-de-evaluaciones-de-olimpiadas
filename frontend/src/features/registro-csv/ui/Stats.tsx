export function Stat({ label, value, accent="neutral" }:{
  label: string; value: string | number; accent?: "neutral"|"success"|"danger";
}) {
  const color = accent==="success" ? "text-emerald-700"
    : accent==="danger" ? "text-rose-700" : "text-neutral-900";
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="text-xs uppercase text-neutral-500">{label}</div>
      <div className={`text-lg font-extrabold ${color}`}>{value}</div>
    </div>
  );
}
