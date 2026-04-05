import { useAuth } from '@/app/context/auth';
import { cn } from '@/app/utils';
import { Button } from '@/views/components/ui/button';
import { Card, CardContent } from '@/views/components/ui/card';
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
    <div
      className={cn(
        'grid overflow-hidden bg-[#06080d] shadow-[0_34px_120px_rgba(2,6,23,0.72)] lg:grid-cols-[0.95fr_1.05fr]',
        className,
      )}
    >
      <div className="relative flex flex-col justify-center p-6 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(211,47,47,0.2),transparent_40%),radial-gradient(circle_at_bottom,rgba(239,68,68,0.08),transparent_45%)]" />
        <div className="relative mx-auto w-full max-w-md space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-400/35 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-red-100">
            <SparklesIcon className="size-3.5" />
            Plataforma FSPH
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
              Entrar na plataforma institucional
            </h1>
            <p className="text-sm leading-6 text-zinc-300 sm:text-base">
              Use suas credenciais para validar o JWT e acessar o fluxo de chat,
              TR e administracao com seguranca.
            </p>
          </div>

          <Card className="bg-transparent shadow-none backdrop-blur-sm">
            <CardContent className='px-0'>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email" className="text-zinc-200">
                      E-mail
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu.email@fsph.gov.br"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="border-white/15 bg-black/40 text-zinc-100 placeholder:text-zinc-500"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password" className="text-zinc-200">
                      Senha
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Sua senha institucional"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="border-white/15 bg-black/40 text-zinc-100 placeholder:text-zinc-500"
                    />
                  </Field>

                  {errorMessage ? (
                    <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                      {errorMessage}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    className="w-full bg-[linear-gradient(120deg,#ef4444,#dc2626_45%,#b91c1c)] text-white hover:brightness-110"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Entrando...' : 'Acessar plataforma'}
                  </Button>

                  <FieldSeparator className="border-white/15 text-zinc-400">
                    Autenticacao segura
                  </FieldSeparator>

                  <FieldDescription className="text-center text-xs leading-5 text-zinc-400">
                    O acesso e validado no backend via JWT, e a sessao e mantida
                    localmente apenas enquanto o token estiver valido.
                  </FieldDescription>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative border-l border-gray-800 min-h-75 overflow-hidden p-6 sm:min-h-95 sm:p-10 lg:min-h-185 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(255,255,255,0.95),rgba(251,113,133,0.28)_32%,transparent_60%),linear-gradient(125deg,#05070b_18%,#190707_50%,#290303_68%,#5f1010_100%)]" />
        <div className="absolute -right-24 top-8 h-105 w-105 rounded-full border border-white/20 bg-white/6 blur-[1px]" />
        <div className="absolute -left-32 -bottom-18 h-85 w-85 rounded-full border border-red-300/20 bg-red-500/10" />

        <div className="relative flex h-full flex-col justify-between gap-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-200">
            Painel FSPH
          </div>

          <div className="space-y-4">
            <h2 className="max-w-xl font-display text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Segurança institucional com experiência moderna.
            </h2>
            <p className="max-w-lg text-sm leading-6 text-zinc-200/90 sm:text-base">
              Uma entrada unica para autenticar, carregar seu perfil e iniciar
              as operacoes de TR no ambiente administrativo da FSPH.
            </p>
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
                description: 'Chat, TR e administracao no mesmo painel.',
                icon: ArrowRightIcon,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/15 bg-black/30 p-4 backdrop-blur"
              >
                <item.icon className="size-5 text-red-300" />
                <p className="mt-3 text-sm font-semibold text-zinc-100">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-5 text-zinc-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
