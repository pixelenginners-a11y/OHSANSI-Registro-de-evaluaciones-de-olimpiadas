import { createFileRoute } from '@tanstack/react-router';
import LogsPage from '../../features/logs/pages/LogsPage';

export const Route = createFileRoute('/admin/logs')({
  component: LogsPage,
});
