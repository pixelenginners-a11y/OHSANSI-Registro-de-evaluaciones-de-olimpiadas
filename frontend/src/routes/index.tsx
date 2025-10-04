// src/routes/index.tsx
import "../style/global.css";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <section className="bg-[#003049] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          ¡Vive la emoción de las
          <br className="hidden md:block" /> Olimpiadas UMSS!
        </h1>

        <p className="mt-4 md:mt-6 text-lg md:text-xl text-[#EAE2B7]">
          Competencia, disciplina y amistad — todo en un solo evento universitario.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {/* Ver reglamento */}
          <a
            href="/reglamento.pdf"
            className="inline-block rounded-xl border border-[#EAE2B7] text-white px-6 py-3 font-semibold hover:bg-white/10 transition"
          >
            Ver reglamento
          </a>

          {/* 🔥 Nuevo botón con gradiente igual al del login */}
          <Link
            to="/login"
            className="inline-block rounded-2xl px-6 py-3.5 font-semibold text-white shadow
                       transition focus:outline-none focus-visible:ring-4
                       focus-visible:ring-[var(--color-accent-red)]/35"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--color-accent-red) 92%, white) 0%, var(--color-accent-red) 100%)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(180deg, color-mix(in srgb, var(--color-accent-red) 85%, white) 0%, color-mix(in srgb, var(--color-accent-red) 96%, white) 100%)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(180deg, color-mix(in srgb, var(--color-accent-red) 92%, white) 0%, var(--color-accent-red) 100%)";
            }}
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </section>
  );
}


