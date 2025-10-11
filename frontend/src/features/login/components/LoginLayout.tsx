import { Logo } from "./Logo";

export const LoginLayout = ({ children }: { children?: React.ReactNode }) => (
  <main className="mx-auto max-w-6xl px-4 py-8">
    <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-secondary-gray)] shadow-[0_16px_40px_-20px_rgba(0,0,0,.35)]">
      <div className="grid md:grid-cols-2">
        <Logo />
        <div className="flex flex-col justify-center p-8 text-[var(--color-primary-dark)]">
          <h2 className="mb-4 text-center text-lg font-semibold">Iniciar Sesión</h2>
          {children}
        </div>
      </div>
    </section>
  </main>
);
