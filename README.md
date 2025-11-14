# 💰 Se Controla - Controle Financeiro Inteligente

Sistema completo de gerenciamento financeiro pessoal e familiar, com foco em controle de receitas, despesas e compartilhamento entre usuários.

## 🚀 Funcionalidades

### ✅ Implementado

- **Autenticação**
  - Login com Google OAuth
  - Gestão de sessões seguras via NextAuth.js

- **Dashboard Completo**
  - Visão geral de receitas, despesas e saldo
  - Gráficos e estatísticas do mês atual
  - Contas pendentes destacadas
  - Transações recentes

- **Gerenciamento de Casas (Households)**
  - Criar espaços de orçamento (individual ou familiar)
  - Sistema de permissões (Owner, Admin, Member)
  - Compartilhamento entre múltiplos usuários

- **Transações (CRUD Completo)**
  - Criar, visualizar, editar e excluir transações
  - Categorização automática
  - Tipos de transação:
    - **Receitas**: Salário, Freelance, Investimentos, etc.
    - **Despesas**: Moradia, Alimentação, Transporte, etc.
  - Frequências:
    - **Fixa**: Sempre o mesmo valor
    - **Variável**: Valor muda
    - **Esporádica**: Não regular
  - Status: Pago ou Pendente
  - Observações e notas

- **Categorias Padrão**
  - 12 categorias pré-configuradas
  - Cores personalizadas por categoria
  - Ícones visuais

- **PWA (Progressive Web App)**
  - Instalável em qualquer dispositivo (Android, iOS, Desktop)
  - Funciona offline com service worker
  - Ícone na tela inicial
  - Atalhos rápidos para ações
  - Notificações push (futuro)

- **Interface Responsiva**
  - 100% otimizado para mobile, tablet e desktop
  - Menu mobile com navegação intuitiva
  - Floating Action Button (FAB) para acesso rápido
  - Cards adaptáveis para telas pequenas
  - Touch-friendly em todos os dispositivos

### 🔜 Próximas Features (Roadmap)

- **Integração Google Calendar**
  - Sincronizar contas pendentes
  - Lembretes automáticos

- **Transações Recorrentes**
  - Criar regras de recorrência (diária, semanal, mensal, anual)
  - Geração automática de transações futuras
  - Gestão de assinaturas e contas fixas

- **Filtros e Busca Avançada**
  - Filtrar por período, categoria, tipo
  - Exportação de dados (CSV, PDF)
  - Relatórios personalizados

- **Gráficos e Analytics**
  - Gráficos de pizza e barras (Recharts)
  - Comparativo mensal
  - Previsões de gastos

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **PWA**: next-pwa + Service Worker
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (Google OAuth)
- **Type Safety**: TypeScript + Zod
- **UI Components**: Radix UI primitives
- **Future**: tRPC, Recharts, Google Calendar API

## 📋 Pré-requisitos

- Node.js 18+ e npm/yarn/pnpm
- PostgreSQL 14+ (local ou remoto)
- Conta Google para configurar OAuth

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone <repo-url>
cd Se-Controla
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Preencha as variáveis no arquivo `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/se-controla?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<gere-um-secret-com-openssl-rand-base64-32>"

# Google OAuth (obtenha em https://console.cloud.google.com)
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"
```

### 4. Configure o Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google+ API** e **Google Calendar API**
4. Vá em **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure a tela de consentimento OAuth
6. Adicione os URIs autorizados:
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copie o Client ID e Client Secret para o `.env`

### 5. Configure o banco de dados

```bash
# Gera o cliente Prisma
npm run db:generate

# Sincroniza o schema com o banco (cria as tabelas)
npm run db:push

# (Opcional) Abra o Prisma Studio para visualizar os dados
npm run db:studio
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📱 Instalar como PWA (Opcional)

### Desktop (Chrome/Edge)
1. Acesse o app no navegador
2. Clique no ícone de "Instalar" na barra de endereço
3. Ou vá em Menu > Instalar Se Controla

### Mobile (Android/iOS)
1. Abra o app no Chrome (Android) ou Safari (iOS)
2. Toque no menu (⋮ ou compartilhar)
3. Selecione "Adicionar à tela inicial"
4. O app aparecerá como ícone nativo!

**Nota**: Para testar PWA localmente, você precisa de HTTPS. Use `ngrok` ou similar para criar um túnel seguro.

## 📂 Estrutura do Projeto

```
Se-Controla/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── households/    # API de Casas
│   │   │   └── transactions/  # API de Transações
│   │   ├── auth/              # Páginas de autenticação
│   │   ├── dashboard/         # Páginas do dashboard
│   │   └── layout.tsx         # Layout raiz
│   ├── components/            # Componentes React
│   │   ├── dashboard/         # Componentes do dashboard
│   │   └── ui/                # Componentes UI (shadcn)
│   ├── lib/                   # Utilitários
│   │   ├── auth.ts            # Configuração NextAuth
│   │   ├── prisma.ts          # Cliente Prisma
│   │   └── utils.ts           # Funções auxiliares
│   └── types/                 # Type definitions
├── .env.example               # Exemplo de variáveis de ambiente
├── package.json               # Dependências
└── README.md                  # Este arquivo
```

## 🎯 Como Usar

### 1. Primeiro Acesso

1. Faça login com sua conta Google
2. Crie sua primeira "Casa" (espaço de orçamento)
3. As categorias padrão serão criadas automaticamente

### 2. Adicionar Transações

1. Clique em "Nova Transação" no dashboard
2. Selecione o tipo (Receita ou Despesa)
3. Escolha a frequência (Fixa, Variável, Esporádica)
4. Preencha os detalhes e salve

### 3. Visualizar e Gerenciar

- **Dashboard**: Visão geral do mês atual
- **Transações**: Lista completa com filtros
- **Casas**: Gerencie seus espaços de orçamento

### 4. Compartilhar com Família

1. Crie uma nova Casa
2. (Em breve) Convide membros via email
3. Todos os membros podem adicionar e visualizar transações

## 🗄️ Modelos de Dados Principais

### User
- Informações do usuário autenticado
- Vinculado às contas Google

### Household (Casa)
- Espaço de orçamento compartilhado
- Pode ter múltiplos membros
- Owner, Admin, Member roles

### Transaction (Transação)
- Receita ou Despesa
- Vinculada a uma Casa e Categoria
- Campos: valor, data, status, frequência, notas

### Category (Categoria)
- Organiza as transações
- Cor e ícone personalizáveis
- Padrão ou customizada

### RecurringTransaction (Futuro)
- Regras de recorrência
- Geração automática de transações

## 🚀 Deploy

**Veja o guia completo em [DEPLOY.md](./DEPLOY.md)**

### Quick Start (Vercel)

1. Gere os ícones PNG a partir do SVG em `/public/icon.svg`
   ```bash
   # Usando ImageMagick
   convert public/icon.svg -resize 192x192 public/icon-192.png
   convert public/icon.svg -resize 512x512 public/icon-512.png
   ```

2. Push para GitHub
   ```bash
   git push origin main
   ```

3. Conecte no [Vercel](https://vercel.com)

4. Configure as variáveis de ambiente (veja `.env.example`)

5. Deploy! 🎉

### Outras Plataformas

Funciona em qualquer plataforma que suporte Next.js:
- Railway
- Render
- AWS Amplify
- Google Cloud Run

## 🔒 Segurança

- Autenticação via OAuth 2.0
- Sessões criptografadas
- Validação de permissões em todas as APIs
- Proteção contra SQL Injection (Prisma)
- HTTPS obrigatório em produção

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📧 Contato

Dúvidas ou sugestões? Abra uma issue no GitHub!

---

**Desenvolvido com ❤️ para ajudar você a ter controle financeiro**
