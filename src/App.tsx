import { AuthProvider } from '@/app/context/auth';
import { isEmbedMode } from '@/app/utils';
import { Router } from '@/routes';
import { Widget } from '@/views/pages/widget';

export function App() {
  if (isEmbedMode()) {
    return <Widget />;
  }

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
