import { AdminPageShell } from '@/views/components/admin/admin-page-shell';
import { Badge } from '@/views/components/ui/badge';
import { Button } from '@/views/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/views/components/ui/card';
import { Input } from '@/views/components/ui/input';
import { Label } from '@/views/components/ui/label';
import { Textarea } from '@/views/components/ui/textarea';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

interface Personality {
  id: string;
  name: string;
  description: string;
  prompt: string;
  createdAt: Date;
}

export function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState<Personality[]>([
    {
      id: '1',
      name: 'Assistente Formal',
      description: 'Linguagem formal e precisa para TRs de alto risco',
      prompt:
        'Você é um especialista em Termos de Referência. Gere documentos formais e altamente estruturados...',
      createdAt: new Date(),
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
  });

  const handleAddPersonality = () => {
    if (!formData.name || !formData.prompt) return;

    const newPersonality: Personality = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date(),
    };

    setPersonalities([...personalities, newPersonality]);
    setFormData({ name: '', description: '', prompt: '' });
    setFormOpen(false);
  };

  const handleDeletePersonality = (id: string) => {
    setPersonalities(personalities.filter((p) => p.id !== id));
  };

  return (
    <AdminPageShell
      breadcrumbs={[
        { label: 'Administrador', href: '/admin/visao-geral' },
        { label: 'Personalidades' },
      ]}
      title="Gerenciar personalidades"
      description="Crie e customize seus próprios pre-prompts para adaptar o assistente de TR ao seu contexto institucional."
      badge="Configuração"
      actions={
        <Button onClick={() => setFormOpen(!formOpen)}>
          <PlusIcon className="size-4" />
          Nova personalidade
        </Button>
      }
      stats={[
        {
          label: 'Personalidades ativas',
          value: personalities.length.toString(),
          description: 'Pre-prompts disponíveis para gerar TRs',
          tone: 'primary',
        },
      ]}
    >
      <div className="grid gap-6">
        {formOpen && (
          <Card>
            <CardHeader>
              <CardTitle>Nova personalidade</CardTitle>
              <CardDescription>
                Defina um nome, descrição e pre-prompt para customizar o
                comportamento do assistente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Ex: Assistente Formal"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Ex: Linguagem formal para TRs de alto risco"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt">Pre-prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Defina as instruções que o assistente deve seguir..."
                  className="min-h-40"
                  value={formData.prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, prompt: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAddPersonality} className="w-full">
                  Salvar personalidade
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFormOpen(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {personalities.map((personality) => (
            <Card key={personality.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {personality.name}
                    </CardTitle>
                    {personality.description && (
                      <CardDescription>
                        {personality.description}
                      </CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePersonality(personality.id)}
                  >
                    <Trash2Icon className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Pre-prompt
                  </Label>
                  <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                    <p className="whitespace-pre-wrap text-muted-foreground">
                      {personality.prompt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Criado em{' '}
                    {personality.createdAt.toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {personalities.length === 0 && !formOpen && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                Nenhuma personalidade criada. Clique em "Nova personalidade"
                para começar.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}
