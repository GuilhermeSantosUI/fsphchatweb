import { isEmbedMode } from '@/app/utils/is-embed-mode';
import { Router } from '@/routes';
import { TooltipProvider } from '@/views/components/ui/tooltip';
import { Widget } from '@/views/pages/widget';

export function App() {
  if (isEmbedMode()) {
    return <Widget />;
  }

  return (
    <TooltipProvider>
      <Router />
    </TooltipProvider>
  );
}
