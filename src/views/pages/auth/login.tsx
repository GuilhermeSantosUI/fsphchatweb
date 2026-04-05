import { LoginForm } from '@/views/components/login-form';

export function LoginPage() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(211,47,47,0.16),transparent_32%),linear-gradient(180deg,#fff_0%,#fafafa_48%,#f5f5f5_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(211,47,47,0.08),transparent)]" />
      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl items-center">
        <LoginForm className="w-full" />
      </div>
    </main>
  );
}
