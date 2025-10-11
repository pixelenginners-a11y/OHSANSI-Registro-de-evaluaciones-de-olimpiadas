// src/components/UnderConstruction.tsx
import { useEffect, useState } from "react";

export default function UnderConstruction() {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBounce((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-dark)] via-[#1e3a5f] to-[var(--color-primary-dark)] flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animación de cono de construcción */}
        <div className="relative mb-8">
          <div
            className={`mx-auto w-32 h-32 transition-transform duration-500 ${
              bounce ? "scale-110 -translate-y-2" : "scale-100 translate-y-0"
            }`}
          >
            {/* Cono */}
            <div className="relative">
              {/* Parte superior del cono */}
              <div className="w-0 h-0 border-l-[64px] border-l-transparent border-r-[64px] border-r-transparent border-b-[96px] border-b-orange-500 mx-auto animate-pulse">
                {/* Franjas blancas */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-4 bg-white opacity-90"></div>
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-4 bg-white opacity-90"></div>
              </div>
            </div>
          </div>

          {/* Partículas flotantes */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Texto principal */}
        <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-primary-light)] mb-4 animate-fade-in">
          Página en Construcción
        </h1>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-[var(--color-primary-light)]/80 mb-8 animate-fade-in-delayed">
          Estamos trabajando en algo increíble...
        </p>

        {/* Barra de progreso animada */}
        <div className="max-w-md mx-auto mb-8">
          <div className="h-3 bg-[var(--color-primary-light)]/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 animate-progress rounded-full"></div>
          </div>
        </div>

        {/* Mensaje adicional */}
        <p className="text-lg text-[var(--color-primary-light)]/60 animate-fade-in-slow">
          Esta sección estará disponible próximamente
        </p>

        {/* Iconos de herramientas animados */}
        <div className="flex justify-center gap-6 mt-12">
          <div className="animate-spin-slow">🔧</div>
          <div className="animate-bounce-slow">🛠️</div>
          <div className="animate-spin-slow" style={{ animationDelay: "0.5s" }}>
            ⚙️
          </div>
        </div>
      </div>

      {/* Estilos adicionales */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0;
          }
          50% {
            transform: translateY(-100px);
            opacity: 0.6;
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-fade-in-slow {
          animation: fade-in 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
