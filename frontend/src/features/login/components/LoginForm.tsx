import { type FormEvent } from "react";

const INPUT_CLASS =
  "w-full rounded-lg bg-white border-2 border-[var(--color-secondary-gray)] " +
  "px-3 py-2 placeholder:text-black/40 outline-none transition " +
  "focus:border-[var(--color-secondary-1)] focus:ring-0";

const BUTTON_BASE_STYLE =
  "linear-gradient(180deg, color-mix(in srgb, var(--color-accent-red) 92%, white) 0%, var(--color-accent-red) 100%)";

const BUTTON_HOVER_STYLE =
  "linear-gradient(180deg, color-mix(in srgb, var(--color-accent-red) 85%, white) 0%, color-mix(in srgb, var(--color-accent-red) 96%, white) 100%)";

type LoginFormProps = {
  email: string;
  password: string;
  loading: boolean;
  canSubmit: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export const LoginForm = ({
  email,
  password,
  loading,
  canSubmit,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {/* Email */}
    <div>
      <label htmlFor="email" className="block text-xs font-medium mb-1">
        Correo
      </label>
      <input
        id="email"
        type="email"
        placeholder="usuario@umss.edu.bo"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        autoComplete="email"
        className={INPUT_CLASS}
        required
      />
    </div>

    {/* Password */}
    <div>
      <label htmlFor="password" className="block text-xs font-medium mb-1">
        Contraseña
      </label>
      <input
        id="password"
        type="password"
        placeholder="********"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        autoComplete="current-password"
        className={`${INPUT_CLASS} pr-10`}
        required
      />
    </div>

    {/* Botón */}
    <button
      type="submit"
      disabled={!canSubmit || loading}
      aria-busy={loading}
      className="
        w-full inline-flex items-center justify-center gap-2
        rounded-2xl px-6 py-3.5 font-semibold text-white
        ring-1 ring-[var(--color-accent-red)]/70
        shadow-[0_18px_34px_-16px_rgba(253,63,91,.7)]
        transition focus:outline-none focus-visible:ring-4
        focus-visible:ring-[var(--color-accent-red)]/35
        disabled:opacity-60 disabled:cursor-not-allowed
      "
      style={{ background: BUTTON_BASE_STYLE }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = BUTTON_HOVER_STYLE;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = BUTTON_BASE_STYLE;
      }}
    >
      {loading ? "Ingresando..." : "Ingresar"}
    </button>
  </form>
);
