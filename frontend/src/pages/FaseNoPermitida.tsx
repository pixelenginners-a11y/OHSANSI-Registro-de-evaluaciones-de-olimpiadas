import React from 'react';
import { usePhaseStore } from '../stores/phaseStore';
import { phaseName } from '../lib/phase';

type Props = {
  fullHeight?: boolean;
  customMessage?: string | null;
};

export default function FaseNoPermitida({ fullHeight = true, customMessage }: Props) {
  const { phase, name } = usePhaseStore();
  const message =
    customMessage ??
    `La funcionalidad no está disponible en la fase actual (${name ?? phaseName(phase) ?? 'Sin fase activa'}).`;

  return (
    <div className={`flex flex-col items-center justify-center ${fullHeight ? 'h-screen' : 'py-10'}`}>
      <div className="bg-red-50 border border-red-200 rounded p-8 text-center max-w-xl w-full mx-auto">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Funcionalidad no permitida</h1>
        <p className="text-lg text-red-600">{message}</p>
        <p className="mt-4 text-gray-500">Por favor, contacta al administrador si crees que esto es un error.</p>
      </div>
    </div>
  );
}
