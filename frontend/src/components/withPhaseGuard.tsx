import React from 'react';
import { usePhaseGuard } from '../hooks/usePhaseGuard';
import FaseNoPermitida from '../pages/FaseNoPermitida';
import type { Functionality } from '../lib/phase';

type Options = {
  fallback?: React.ReactNode;
};

export function withPhaseGuard<P extends object>(funcionalidad: Functionality, options?: Options) {
  return (WrappedComponent: React.ComponentType<P>) => {
    const ComponentWithGuard: React.FC<P> = (props) => {
      const { allowed, loading, message } = usePhaseGuard(funcionalidad);

      if (loading) return <div>Cargando fase...</div>;
      if (!allowed) {
        if (options?.fallback) return <>{options.fallback}</>;
        return <FaseNoPermitida fullHeight={false} customMessage={message} />;
      }

      return <WrappedComponent {...props} />;
    };

    return ComponentWithGuard;
  };
}
