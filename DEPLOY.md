# 🚀 Guia de Deploy - Se Controla

Este guia explica como fazer o deploy do app **Se Controla** para produção.

## 📋 Pré-requisitos

Antes de fazer o deploy, você precisa:

1. ✅ Conta no [Vercel](https://vercel.com) (grátis)
2. ✅ Banco de dados PostgreSQL (use [Supabase](https://supabase.com) grátis ou [Neon](https://neon.tech))
3. ✅ Credenciais do Google OAuth configuradas
4. ✅ Ícones PNG gerados (veja seção abaixo)

## 🎨 Gerar Ícones PWA

Os ícones precisam estar em formato PNG. Use uma das opções:

### Opção 1: Converter o SVG online
1. Vá em [CloudConvert](https://cloudconvert.com/svg-to-png)
2. Faça upload do arquivo `/public/icon.svg`
3. Converta para PNG em dois tamanhos:
   - 192x192px → salve como `icon-192.png`
   - 512x512px → salve como `icon-512.png`
4. Coloque os arquivos em `/public/`

### Opção 2: Usar ImageMagick (linha de comando)
```bash
# Instale o ImageMagick primeiro
# Ubuntu/Debian: sudo apt-get install imagemagick
# macOS: brew install imagemagick

# Converta o SVG
convert public/icon.svg -resize 192x192 public/icon-192.png
convert public/icon.svg -resize 512x512 public/icon-512.png
```

### Opção 3: Usar um gerador online
1. Vá em [PWA Asset Generator](https://www.pwabuilder.com/)
2. Faça upload de uma imagem 512x512px
3. Baixe os ícones gerados
4. Substitua os arquivos em `/public/`

## 🗄️ Configurar Banco de Dados

### Opção A: Supabase (Recomendado - Grátis)

1. Acesse [Supabase](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em **Settings** > **Database**
4. Copie a **Connection String** (formato URI)
5. A URL terá este formato:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
   ```

### Opção B: Neon (Alternativa Grátis)

1. Acesse [Neon](https://neon.tech) e crie uma conta
2. Crie um novo projeto PostgreSQL
3. Copie a Connection String fornecida

### Opção C: Vercel Postgres

1. No projeto Vercel, vá em **Storage**
2. Crie um banco Postgres
3. Copie a URL de conexão

## 🔐 Configurar Google OAuth

### 1. Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. No menu lateral, vá em **APIs & Services** > **Credentials**

### 2. Configurar OAuth Consent Screen

1. Clique em **OAuth consent screen**
2. Escolha **External** e clique em **Create**
3. Preencha:
   - **App name**: Se Controla
   - **User support email**: seu email
   - **Developer contact**: seu email
4. Clique em **Save and Continue**
5. Em **Scopes**, adicione:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/calendar` (para Google Calendar)
6. Clique em **Save and Continue**
7. Em **Test users**, adicione seu email (para testar)
8. Clique em **Save and Continue**

### 3. Criar Credenciais OAuth

1. Vá em **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
2. Escolha **Web application**
3. Preencha:
   - **Name**: Se Controla Web
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://seu-dominio.vercel.app
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     https://seu-dominio.vercel.app/api/auth/callback/google
     ```
4. Clique em **Create**
5. **Copie o Client ID e Client Secret** (você vai precisar!)

## 🚢 Deploy no Vercel

### 1. Push do código para GitHub

```bash
# Adicione suas mudanças
git add .
git commit -m "feat: PWA ready for deployment"
git push origin claude/expense-income-tracker-app-01Q4yPBkE11oVLBFwt9sEvHR
```

### 2. Importar no Vercel

1. Acesse [Vercel](https://vercel.com)
2. Clique em **Add New** > **Project**
3. Importe seu repositório do GitHub
4. Configure o projeto:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)

### 3. Configurar Variáveis de Ambiente

No Vercel, vá em **Settings** > **Environment Variables** e adicione:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=<gere-um-secret-seguro>

# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
```

**Como gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Deploy!

1. Clique em **Deploy**
2. Aguarde o build (2-5 minutos)
3. Acesse a URL fornecida

### 5. Configurar Banco de Dados

Após o primeiro deploy, execute:

```bash
# Localmente, com a DATABASE_URL de produção no .env
npm run db:push
```

Ou use o Vercel CLI:

```bash
# Instale o Vercel CLI
npm i -g vercel

# Conecte ao projeto
vercel link

# Execute o comando de migração
vercel env pull .env.production
npm run db:push
```

## 📱 Testar o PWA

1. Acesse o app no celular através da URL do Vercel
2. No Chrome/Safari: menu > **Adicionar à tela inicial** ou **Instalar app**
3. O ícone do app aparecerá na tela inicial
4. Abra o app - ele funcionará como nativo!

## 🔄 Atualizações Futuras

Para fazer updates:

```bash
# Faça suas mudanças
git add .
git commit -m "feat: nova funcionalidade"
git push

# O Vercel faz deploy automático!
```

## ✅ Checklist Final

Antes de publicar, verifique:

- [ ] Ícones PNG 192x192 e 512x512 criados em `/public/`
- [ ] Banco de dados PostgreSQL configurado
- [ ] Google OAuth credenciais criadas
- [ ] Redirect URIs do Google atualizadas com URL do Vercel
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Database migrado com `npm run db:push`
- [ ] App testado no celular (instalação PWA)
- [ ] Login com Google funcionando
- [ ] Transações criando e salvando

## 🐛 Troubleshooting

### Erro: "OAuth Error - redirect_uri_mismatch"
**Solução**: Verifique se a URL do Vercel está correta nas Redirect URIs do Google Cloud Console

### Erro: "Database connection failed"
**Solução**: Verifique se a `DATABASE_URL` está correta e se o banco está acessível

### PWA não aparece para instalar
**Solução**:
1. Verifique se os ícones PNG existem em `/public/`
2. Acesse via HTTPS (Vercel já fornece)
3. Limpe o cache do navegador

### Service Worker não atualiza
**Solução**: O PWA está configurado para `skipWaiting: true`, mas você pode forçar:
1. DevTools > Application > Service Workers
2. Clique em **Unregister** e recarregue

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no Vercel: **Deployments** > **Functions**
2. Abra uma issue no GitHub do projeto
3. Consulte a [documentação do Next.js](https://nextjs.org/docs)

---

**Pronto!** Seu app estará no ar e instalável em qualquer dispositivo! 🎉
