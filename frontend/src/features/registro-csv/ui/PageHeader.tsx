export default function PageHeader({ title, subtitle }: {title: string; subtitle?: string}) {
  return (
    <header className="mx-auto w-full max-w-6xl px-4 pt-8 md:px-6">
      <h1 className="text-3xl font-extrabold leading-tight text-neutral-900 md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-neutral-600 md:text-base">{subtitle}</p>}
    </header>
  );
}
