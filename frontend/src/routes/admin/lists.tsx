import { createFileRoute } from '@tanstack/react-router';
import { Lists } from '../../features/lists/pages/Lists';

export const Route = createFileRoute('/admin/lists')({
  component: Lists,
});
