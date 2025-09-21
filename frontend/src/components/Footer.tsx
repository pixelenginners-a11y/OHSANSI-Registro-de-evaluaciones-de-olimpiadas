export default function Footer() {
  return (
    <footer className="bg-[#003049] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <h2 className="font-bold text-lg mb-3">Olimpiadas UMSS 2025</h2>
          <p className="text-sm text-[#EAE2B7]">
            Competencia, disciplina y amistad — unidos en el evento científico universitario más grande de Bolivia.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3">Enlaces</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#F77F00]">Inicio</a></li>
            <li><a href="#" className="hover:text-[#F77F00]">Inscripciones</a></li>
            <li><a href="#" className="hover:text-[#F77F00]">Resultados</a></li>
            <li><a href="#" className="hover:text-[#F77F00]">Contacto</a></li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3">Contacto</h2>
          <ul className="space-y-2 text-sm">
            <li>
              Email:{" "}
              <a href="mailto:info@umss.bo" className="hover:text-[#F77F00]">
                info@umss.bo
              </a>
            </li>
            <li>
              Teléfono:{" "}
              <span className="text-[#EAE2B7]">+591 4 1234567</span>
            </li>
            <li>
              Dirección:{" "}
              <span className="text-[#EAE2B7]">Cochabamba, Bolivia</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#D62828] text-center py-3 text-sm">
        © 2025 Olimpiadas UMSS — Todos los derechos reservados
      </div>
    </footer>
  );
}
