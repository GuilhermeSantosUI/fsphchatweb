import { LoginForm } from '@/views/components/login-form';

export function LoginPage() {
  return (
    <main className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(239,68,68,0.16),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(255,255,255,0.22),transparent_25%),linear-gradient(140deg,#04060a_8%,#090d14_42%,#170606_72%,#250707_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(239,68,68,0.14),transparent_48%)]" />
      <div className="pointer-events-none absolute left-1/2 -top-30 h-70 w-135 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
      <div className="relative flex w-full items-center max-h-screen min-h-screen">
        <LoginForm className="w-full" />
      </div>
    </main>
  );
}
