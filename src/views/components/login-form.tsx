import { useAuth } from '@/app/context/auth';
import { cn } from '@/app/utils';
import { Button } from '@/views/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/views/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/views/components/ui/field';
import { Input } from '@/views/components/ui/input';
import { ArrowRightIcon, BadgeCheckIcon, ShieldCheckIcon, SparklesIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type LoginFormProps = {
  className?: string;
};

export function LoginForm({ className }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/admin/visao-geral', { replace: true });
    } catch {
      setErrorMessage(
        'Nao foi possivel autenticar. Confira as credenciais e tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn('grid gap-6 lg:grid-cols-[1.08fr_0.92fr]', className)}>
      <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[linear-gradient(135deg,rgba(211,47,47,0.12),rgba(255,255,255,0.96)_40%,rgba(211,47,47,0.05))] p-8 shadow-[0_24px_80px_rgba(17,24,39,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(211,47,47,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(17,24,39,0.08),transparent_35%)]" />
        <div className="relative flex h-full flex-col justify-between gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <SparklesIcon className="size-3.5" />
              Plataforma FSPH
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl font-display text-4xl leading-tight font-semibold tracking-tight text-foreground md:text-5xl">
                Acesse a plataforma de TR com autenticação institucional.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                Entre com seu e-mail e senha para validar o JWT, acessar a base
                RAG e operar a geração de Termos de Referência com segurança.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                title: 'JWT validado',
                description: 'Sessao protegida em todas as rotas privadas.',
                icon: ShieldCheckIcon,
              },
              {
                title: 'Perfil carregado',
                description: 'Usuario e role carregados apos o login.',
                icon: BadgeCheckIcon,
              },
              {
                title: 'Fluxo unico',
                description: 'Chat, TR e administracao em um só painel.',
                icon: ArrowRightIcon,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur"
              >
                <item.icon className="size-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="border-border/70 bg-card/95 shadow-[0_16px_48px_rgba(17,24,39,0.12)] backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Entrar na plataforma</CardTitle>
          <CardDescription>
            Use suas credenciais da FSPH para acessar a area autenticada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu.email@fsph.gov.br"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Sua senha institucional"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>

              {errorMessage ? (
                <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Acessar plataforma'}
              </Button>

              <FieldSeparator>Autenticacao segura</FieldSeparator>

              <FieldDescription className="text-center text-xs leading-5">
                O acesso é validado no backend via JWT, e a sessão é mantida de
                forma local apenas enquanto o token for válido.
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
