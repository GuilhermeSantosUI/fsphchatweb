import { LoginForm } from '@/views/components/login-form';

export function LoginPage() {
  return (
    <main className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(239,68,68,0.16),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(255,255,255,0.22),transparent_25%),linear-gradient(140deg,#04060a_8%,#090d14_42%,#170606_72%,#250707_100%)] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(239,68,68,0.14),transparent_48%)]" />
      <div className="pointer-events-none absolute left-1/2 -top-30 h-70 w-135 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-7xl items-center">
        <LoginForm className="w-full" />
      </div>
    </main>
  );
}
