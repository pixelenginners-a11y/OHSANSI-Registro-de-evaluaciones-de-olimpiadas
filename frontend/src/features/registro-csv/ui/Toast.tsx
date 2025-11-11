import { useEffect, useState } from "react";

export default function Toast({
  open, text, onClose, duration = 4000,
}: { open: boolean; text: string; duration?: number; onClose: () => void; }) {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Pequeño delay para que la animación de entrada se active
      setTimeout(() => setVisible(true), 10);

      const t = setTimeout(() => {
        setVisible(false);
        // Esperar a que termine la animación de salida antes de desmontar
        setTimeout(() => {
          setShouldRender(false);
          onClose();
        }, 300);
      }, duration);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [open, duration, onClose]);

  if (!shouldRender) return null;

  // Limpiar emojis del texto para mostrarlo sin ellos
  const cleanText = text.replace(/[❌✅]/g, '').trim();
  const isError = text.includes('❌');
  const isSuccess = text.includes('✅');

  return (
    <div className={`fixed right-4 top-4 z-[70] max-w-sm transition-all duration-300 ease-out ${
      visible
        ? 'translate-y-0 opacity-100'
        : '-translate-y-4 opacity-0'
    }`}>
      <div className={`rounded-lg shadow-lg border ${
        isError ? 'bg-red-50 border-red-200' :
        isSuccess ? 'bg-emerald-50 border-emerald-200' :
        'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-start gap-3 px-4 py-3">
          {isSuccess && (
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {isError && (
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {!isSuccess && !isError && (
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium leading-snug ${
              isError ? 'text-red-800' :
              isSuccess ? 'text-emerald-800' :
              'text-blue-800'
            }`}>
              {cleanText}
            </p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(() => {
                setShouldRender(false);
                onClose();
              }, 300);
            }}
            className={`flex-shrink-0 rounded hover:bg-white/50 p-1 transition-colors ${
              isError ? 'text-red-400 hover:text-red-600' :
              isSuccess ? 'text-emerald-400 hover:text-emerald-600' :
              'text-blue-400 hover:text-blue-600'
            }`}
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
