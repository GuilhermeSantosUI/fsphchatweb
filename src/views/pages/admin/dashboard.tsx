import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/views/components/ui/card';

export function Dashboard() {
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Visão geral do sistema</CardTitle>
          <CardDescription>
            Plataforma para apoiar a criação de Termos de Referência (TR) da
            FSPH com rastreabilidade e consistência documental.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            A aplicação utiliza RAG (Retrieval-Augmented Generation) para
            recuperar conteúdo relevante da base vetorial antes da geração do
            texto final, mantendo o documento alinhado ao histórico real.
          </p>
          <div className="inline-flex rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Tema institucional ativo via token primary
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardTitle>1. Recuperação</CardTitle>
            <CardDescription>
              Busca semântica em base vetorial de TRs históricos.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>2. Ground Truth</CardTitle>
            <CardDescription>
              Priorização de evidências reais para reduzir alucinações.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>3. Geração assistida</CardTitle>
            <CardDescription>
              Produção do TR com base em contexto recuperado e validável.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Benefícios para a FSPH</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Padronização dos documentos de contratação.</li>
            <li>Maior velocidade na elaboração de TRs.</li>
            <li>Base de decisão ancorada em documentos reais.</li>
            <li>Melhor transparência e rastreabilidade do conteúdo gerado.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
