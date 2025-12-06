import { createFileRoute } from '@tanstack/react-router';
import CertificadoPage from '../../features/certificado/pages/CertificadoPage';

export const Route = createFileRoute('/admin/certificado')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CertificadoPage />;
}
