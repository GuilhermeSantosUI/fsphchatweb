import type { AIUIMessage } from '@/types/ai-messages';

export const INITIAL_MESSAGES: AIUIMessage[] = [
  {
    id: '1',
    parts: [
      {
        type: 'text',
        text: 'Olá! Preciso montar um Termo de Referência para contratação de serviço na FSPH. Você pode me guiar passo a passo?',
      },
    ],
    role: 'user',
  },
  {
    id: '2',
    parts: [
      {
        type: 'tool-get-project-management-resources',
        toolCallId: 'tr-structure-1',
        state: 'output-available',
        input: {
          topic:
            'estrutura de termo de referência para contratação de serviço na FSPH',
        },
        output:
          'Estrutura sugerida de TR: 1) Objeto da contratação, 2) Justificativa e necessidade, 3) Especificações técnicas, 4) Quantitativos, 5) Critérios de aceitação, 6) Obrigações da contratada e da contratante, 7) Prazo de execução, 8) Critérios de medição e pagamento, 9) Gestão e fiscalização contratual, 10) Requisitos de habilitação.',
      },
      {
        type: 'text',
        text: 'Perfeito! Vamos montar seu Termo de Referência com foco em conformidade e objetividade.\n\n#### Estrutura inicial do TR\n1. **Objeto da contratação**\n2. **Justificativa da necessidade**\n3. **Especificações técnicas**\n4. **Quantitativos e unidades**\n5. **Critérios de aceitação**\n6. **Prazos e cronograma**\n7. **Medição e pagamento**\n8. **Fiscalização do contrato**\n\nQuer começar pelo item 1 (Objeto) e item 2 (Justificativa)?',
      },
    ],
    role: 'assistant',
  },
  {
    id: '3',
    parts: [
      {
        type: 'text',
        text: 'Sim. O objeto é contratar solução com IA para apoiar a elaboração de Termos de Referência com base em documentos anteriores. Como descrevo isso corretamente?',
      },
    ],
    role: 'user',
  },
  {
    id: '4',
    parts: [
      {
        type: 'tool-get-task-breakdown-guidance',
        toolCallId: 'tr-object-1',
        state: 'output-available',
        input: {
          projectType: 'elaboração de termo de referência com apoio de IA',
          complexity: 'moderate',
        },
        output: {
          approach:
            'Estruturação orientada por seções obrigatórias do Termo de Referência',
          guidelines: [
            'Descrever o resultado esperado e não apenas a tecnologia',
            'Evitar direcionamento de marca ou fornecedor específico',
            'Indicar requisitos mínimos funcionais e de segurança da informação',
            'Vincular o objeto à necessidade administrativa da FSPH',
          ],
          exampleTasks: [
            'Definir objeto e justificativa - 1 dia - Prioridade: Alta',
            'Consolidar especificações técnicas e critérios de aceitação - 2 dias - Dependência: alinhamento com área demandante',
            'Estruturar medição, pagamento e fiscalização contratual - 1 dia - Dependência: validação administrativa',
          ],
        },
      },
      {
        type: 'text',
        text: 'Ótimo ponto. Para o item **Objeto**, você pode usar este texto-base:\n\n##### Minuta de Objeto\nContratação de solução tecnológica baseada em IA, com arquitetura RAG e base vetorial, para apoiar a elaboração de Termos de Referência da FSPH, por meio de recuperação de informações de documentos históricos institucionais (ground truth), promovendo padronização, rastreabilidade e redução de alucinações na geração de conteúdo.\n\n##### Boas práticas de redação\n- Descrever o que será entregue e o benefício esperado\n- Evitar termos que restrinjam a competitividade\n- Incluir requisitos mínimos de desempenho, segurança e auditoria\n- Manter linguagem objetiva e verificável',
      },
    ],
    role: 'assistant',
  },
  {
    id: '5',
    parts: [
      {
        type: 'text',
        text: 'Perfeito. E como posso estruturar os critérios de aceitação e de pagamento para esse TR?',
      },
    ],
    role: 'user',
  },
  {
    id: '6',
    parts: [
      {
        type: 'tool-recommend-project-tools',
        toolCallId: 'tr-criteria-1',
        state: 'output-available',
        input: {
          teamSize: 5,
          budget: 'medium',
          needs: [
            'elaboração de TR',
            'padronização documental',
            'fluxo de revisão técnica',
          ],
        },
        output: {
          primaryRecommendation: {
            name: 'Fluxo estruturado de validação do TR',
            advantages: [
              'Critérios de aceitação objetivos e auditáveis',
              'Medição mensal com indicadores claros',
              'Rastreabilidade das fontes (ground truth)',
              'Maior segurança jurídica e técnica',
            ],
            setup:
              'Aceitação: acurácia mínima + rastreabilidade documental + disponibilidade mínima. Pagamento: mensal, condicionado ao cumprimento dos SLAs, com glosa proporcional por não conformidade.',
          },
          alternatives: [
            {
              name: 'Modelo simplificado por checklist técnico',
              benefits: [
                'Implementação mais rápida',
                'Fácil auditoria',
                'Boa adaptação para equipes pequenas',
              ],
            },
          ],
        },
      },
      {
        type: 'text',
        text: 'Excelente pergunta. Para deixar o TR auditável e executável, recomendo:\n\n##### Critérios de aceitação\n- Indicadores objetivos de qualidade técnica\n- Evidência de aderência às fontes históricas (ground truth)\n- Verificação de segurança, logs e rastreabilidade\n- Testes de desempenho e disponibilidade\n\n##### Critérios de medição e pagamento\n- Medição mensal por indicadores de nível de serviço (SLA)\n- Pagamento vinculado ao cumprimento de metas mínimas\n- Previsão de glosa proporcional quando houver descumprimento\n\nQuer que eu monte agora uma minuta completa do TR com esses tópicos preenchidos?',
      },
    ],
    role: 'assistant',
  },
  {
    id: '7',
    parts: [
      {
        type: 'text',
        text: 'Sim, por favor. Pode gerar uma versão inicial completa do TR com linguagem formal e pronta para revisão jurídica?',
      },
    ],
    role: 'user',
  },
  {
    id: '8',
    parts: [
      {
        type: 'tool-recommend-project-tools',
        toolCallId: 'tr-draft-1',
        state: 'output-available',
        input: {
          teamSize: 5,
          budget: 'medium',
          needs: [
            'minuta completa de TR',
            'linguagem formal administrativa',
            'pronto para revisão jurídica',
          ],
        },
        output: {
          primaryRecommendation: {
            name: 'Minuta inicial completa de TR',
            advantages: [
              'Estrutura formal com seções essenciais',
              'Critérios técnicos objetivos',
              'Base para revisão técnica e jurídica',
              'Alinhamento com necessidade da FSPH',
            ],
            setup:
              'Seções preenchidas: objeto, justificativa, especificações, aceitação, medição/pagamento e fiscalização; linguagem formal-administrativa.',
          },
          alternatives: [
            {
              name: 'Versão resumida (enxuta)',
              benefits: [
                'Mais rápida para circular internamente',
                'Foco no essencial',
                'Facilita consolidação inicial',
              ],
            },
          ],
        },
      },
      {
        type: 'text',
        text: 'Perfeito — já consigo te entregar uma **minuta inicial completa de Termo de Referência** para a FSPH, com linguagem formal, critérios objetivos e estrutura pronta para revisão técnica e jurídica.\n\nPosso seguir agora com: \n1. versão resumida (enxuta), ou\n2. versão detalhada (mais robusta para instrução processual).\n\nQual formato você prefere?',
      },
    ],
    role: 'assistant',
  },
];
