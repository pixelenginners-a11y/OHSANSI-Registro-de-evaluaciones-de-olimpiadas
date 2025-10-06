import { type FormEvent } from "react";
import { LogoSection } from "./LogoSection";
import { ErrorMessage } from "./ErrorMessage";
import { LoginForm } from "./LoginForm";

type LoginPanelProps = {
  email: string;
  password: string;
  loading: boolean;
  canSubmit: boolean;
  error: string | null;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export const LoginPanel = ({
  email,
  password,
  loading,
  canSubmit,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginPanelProps) => (
  <main className="mx-auto max-w-6xl px-4 py-8">
    <section
      className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-[var(--color-primary-light)]"
      style={{
        boxShadow: "0 16px 40px -20px rgba(0,0,0,.35)",
        border: "1px solid var(--color-secondary-gray)",
      }}
    >
      <div className="grid md:grid-cols-2">
        <LogoSection />

        <div className="p-8 text-[var(--color-primary-dark)]">
          <h2 className="text-lg font-semibold text-center mb-4">
            Iniciar Sesión
          </h2>

          {error && <ErrorMessage message={error} />}

          <LoginForm
            email={email}
            password={password}
            loading={loading}
            canSubmit={canSubmit}
            onEmailChange={onEmailChange}
            onPasswordChange={onPasswordChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </section>
  </main>
);
