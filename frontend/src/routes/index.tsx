import '../style/global.css'
import { createFileRoute, Link } from '@tanstack/react-router'  

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <section className="bg-[#003049] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          ¡Vive la emoción de las<br className="hidden md:block" /> Olimpiadas UMSS!
        </h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-[#EAE2B7]"> 
          Competencia, disciplina y amistad — todo en un solo evento universitario.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {/* Ir a tu HU-1 */}
          <Link to="/concursantes/registro"
            className="inline-block rounded-xl bg-[#F77F00] text-[#003049] px-6 py-3 font-semibold shadow hover:opacity-90 transition"
          >
            Inscribirme ahora
          </Link>

          {/* Ejemplo: si “Ver reglamento” va a una ruta interna, usa Link; si es PDF externo, usa <a href> */}
          <a
            href="/reglamento.pdf" // o reemplaza por la ruta interna con <Link to="/reglamento">
            className="inline-block rounded-xl border border-[#EAE2B7] text-white px-6 py-3 font-semibold hover:bg-white/10 transition"
          >
            Ver reglamento
          </a>
        </div>
      </div>
    </section>
  )
}
