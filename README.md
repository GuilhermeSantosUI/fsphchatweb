# FSPH Web Chat

FSPH Web Chat é uma aplicação frontend em React (Vite) projetada para fornecer uma interface de chat inteligente no painel administrativo. A aplicação suporta a integração com sistemas de inteligência artificial via RAG (Retrieval-Augmented Generation), permitindo o gerenciamento de uma base documental rica (PDF, DOCX, TXT) e geração de embeddings.

## 🚀 Tecnologias Utilizadas

- **Core**: React 19, TypeScript, Vite
- **Estilização**: Tailwind CSS v4, Radix UI (Shadcn UI), Lucide React, Phosphor Icons
## 📋 Pré-requisitos

- Node.js (v18 ou superior recomendado)
- NPM, Yarn ou pnpm

## 🔧 Instalação e Configuração Local

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configuração de Variáveis de Ambiente:**
   Crie ou edite o arquivo `.env` na raiz do projeto e configure a URL da sua API backend:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

## 📦 Build e Implantação

A aplicação possui a interface completa (App/Admin)

### 1. Build da Aplicação Principal
Para gerar os arquivos estáticos de produção:
```bash
npm run build
```
Os arquivos otimizados serão gerados na pasta `dist/`.

## 🔐 Painel Administrativo

O painel administrativo (`/admin/chat`) permite ao usuário logado o gerenciamento da base de conhecimento da IA.

- **Upload de Documentos**: Arraste ou selecione arquivos (PDF, DOCX, TXT até 20MB) para alimentar a base vetorial.
- **Criação de Documentos em Texto**: Utilize o editor interno para redigir diretrizes, normas e contextos específicos. Estes textos são convertidos em `.txt` e enviados para indexação.
- **Sincronização e Reindexação**: O sistema permite a reindexação da base de dados vetorial para assegurar que a IA possua as informações mais recentes durante as respostas.