import umssLogo from "../../../assets/umss-logo.png";

export const Logo = () => (
  <div className="relative p-8"
    style={{
      background: "color-mix(in srgb, var(--color-secondary-2) 16%, var(--color-primary-light))",
    }}
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_480px_at_10%_0%,rgba(0,0,0,.06),transparent)]" />
    <h2 className="relative text-lg font-semibold text-center mb-2 text-[var(--color-primary-dark)]">
      Bienvenido/a
    </h2>
    <div className="mx-auto grid place-items-center w-72 h-72 bg-white border border-[var(--color-secondary-gray)] rounded-md overflow-hidden">
      <img
        src={umssLogo}
        alt="Logo UMSS"
        className="w-[70%] h-[70%] object-contain"
        loading="eager"
      />
    </div>
  </div>
);
