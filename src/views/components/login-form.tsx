import { useAuth } from '@/app/context/auth';
import { cn } from '@/app/utils';
import logoImg from '@/assets/fsph-logo.png';
import { Button } from '@/views/components/ui/button';
import { Card, CardContent } from '@/views/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/views/components/ui/field';
import { Input } from '@/views/components/ui/input';
import { ArrowRightIcon, BadgeCheckIcon, ShieldCheckIcon } from 'lucide-react';
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
        'grid overflow-hidden bg-white shadow-[0_34px_120px_rgba(0,0,0,0.08)] lg:grid-cols-[0.95fr_1.05fr]',
        className,
      )}
    >
      <div className="relative flex flex-col justify-center p-6 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(211,47,47,0.08),transparent_40%),radial-gradient(circle_at_bottom,rgba(211,47,47,0.04),transparent_45%)]" />
        <div className="relative mx-auto w-full max-w-md space-y-8">
          <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <img
              src={logoImg}
              alt="FSPH Logo"
              className="w-6 h-6 relative -left-0.5"
            />
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Entrar na plataforma institucional
            </h1>
            <p className="text-sm leading-6 text-gray-600 sm:text-base">
              Use suas credenciais para validar o JWT e acessar o fluxo de chat,
              TR e administracao com seguranca.
            </p>
          </div>

          <Card className="bg-transparent shadow-none backdrop-blur-sm">
            <CardContent className="px-0">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email" className="text-gray-700">
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
                      className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password" className="text-gray-700">
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
                      className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
                    />
                  </Field>

                  {errorMessage ? (
                    <p className="rounded-xl border border-[#d32f2f]/30 bg-[#d32f2f]/10 px-3 py-2 text-sm text-[#d32f2f]">
                      {errorMessage}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    className="w-full bg-[#d32f2f] text-white hover:bg-[#b71c1c]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Entrando...' : 'Acessar plataforma'}
                  </Button>

                  <FieldSeparator className="border-gray-200 text-gray-500">
                    Autenticacao segura
                  </FieldSeparator>

                  <FieldDescription className="text-center text-xs leading-5 text-gray-500">
                    O acesso e validado no backend via JWT, e a sessao e mantida
                    localmente apenas enquanto o token estiver valido.
                  </FieldDescription>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative border-l border-gray-200 min-h-75 overflow-hidden p-6 sm:min-h-95 sm:p-10 lg:min-h-185 lg:p-12 bg-gradient-to-br from-red-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(211,47,47,0.1),transparent_60%),radial-gradient(125deg,#ffffff_18%,#fef2f2_50%,#fdf8f8_100%)]" />
        <div className="absolute -right-24 top-8 h-105 w-105 rounded-full border border-red-200 bg-red-50/40 blur-[1px]" />
        <div className="absolute -left-32 -bottom-18 h-85 w-85 rounded-full border border-red-100 bg-red-50/20" />

        <div className="relative flex h-full flex-col justify-between gap-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs uppercase tracking-[0.16em] text-gray-700">
            Painel FSPH
          </div>

          <div className="space-y-4">
            <h2 className="max-w-xl font-display text-3xl leading-tight font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Segurança institucional com experiência moderna.
            </h2>
            <p className="max-w-lg text-sm leading-6 text-gray-600 sm:text-base">
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
                className="rounded-2xl border border-red-200 bg-red-50/50 p-4 backdrop-blur"
              >
                <item.icon className="size-5 text-[#d32f2f]" />
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-5 text-gray-600">
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
