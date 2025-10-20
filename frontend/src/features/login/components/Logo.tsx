import umssLogo from "../../../assets/umss-logo.png";

export const Logo = () => (
  <div className="relative p-8 flex flex-col justify-center items-center"
    style={{
      background: "color-mix(in srgb, var(--color-secondary-2) 16%, var(--color-primary-light))",
    }}
  >
    <h2 className="text-center text-lg font-semibold mb-2 text-[var(--color-primary-dark)]">
      Bienvenido/a
    </h2>
    <div className="grid place-items-center bg-white border border-[var(--color-secondary-gray)] rounded-md">
      <img
        src={umssLogo}
        alt="Logo UMSS"
        className="w-72 h-72 object-contain rounded-md"
        loading="eager"
      />
    </div>
  </div>
);
