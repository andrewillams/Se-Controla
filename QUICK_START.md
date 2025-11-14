# 🚀 Quick Start - Publicar o Se Controla

Guia rápido para colocar seu app no ar em 15 minutos!

## 📋 O que você precisa (grátis)

1. [ ] Conta no [Vercel](https://vercel.com) - Deploy e hosting
2. [ ] Conta no [Supabase](https://supabase.com) - Banco PostgreSQL
3. [ ] Google Cloud Console - OAuth credentials

## 🎯 Passo a Passo (15 min)

### 1️⃣ Criar Ícones PWA (2 min)

**Opção fácil**: Use um conversor online
1. Vá em https://cloudconvert.com/svg-to-png
2. Faça upload de `public/icon.svg`
3. Converta para:
   - 192x192px → salve como `public/icon-192.png`
   - 512x512px → salve como `public/icon-512.png`

**Opção rápida**: Use ImageMagick (se tiver instalado)
```bash
convert public/icon.svg -resize 192x192 public/icon-192.png
convert public/icon.svg -resize 512x512 public/icon-512.png
git add public/*.png
git commit -m "feat: add PWA icons"
git push
```

### 2️⃣ Configurar Banco de Dados (3 min)

1. Acesse https://supabase.com
2. Crie uma conta e novo projeto
3. Copie a **Connection String**:
   - Settings > Database > Connection String > URI
   - Exemplo: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`

### 3️⃣ Configurar Google OAuth (5 min)

1. Acesse https://console.cloud.google.com
2. Crie um novo projeto "Se Controla"
3. **APIs & Services** > **Credentials**
4. **OAuth consent screen**:
   - External > Create
   - Nome: Se Controla
   - Email: seu email
   - Save and Continue
5. **Create Credentials** > **OAuth 2.0 Client ID**:
   - Web application
   - Nome: Se Controla Web
   - **Authorized redirect URIs**: (adicione estas duas)
     ```
     http://localhost:3000/api/auth/callback/google
     https://SEU-APP.vercel.app/api/auth/callback/google
     ```
   - Create
   - **COPIE** Client ID e Client Secret

### 4️⃣ Deploy no Vercel (5 min)

1. Acesse https://vercel.com e faça login com GitHub
2. **Add New** > **Project**
3. Importe o repositório **Se-Controla**
4. **Configure** variáveis de ambiente:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=cole-um-random-string-aqui
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
```

**Como gerar NEXTAUTH_SECRET**: Cole isso no terminal
```bash
openssl rand -base64 32
```

5. Clique em **Deploy**
6. Aguarde 2-3 minutos

### 5️⃣ Configurar Database e Atualizar OAuth

1. Após o deploy, **copie a URL** do Vercel (ex: `https://se-controla-xyz.vercel.app`)

2. **Volte ao Google Cloud Console**:
   - Credentials > Seu OAuth Client
   - Edite e adicione a URL do Vercel nos Redirect URIs
   - Salve

3. **Migrar o banco**:
   ```bash
   # No terminal local
   # Copie a DATABASE_URL de produção para o .env
   npm run db:push
   ```

## ✅ Testar o App

1. Acesse a URL do Vercel
2. Clique em "Entrar com Google"
3. Autorize o app
4. Crie sua primeira Casa
5. Adicione uma transação

## 📱 Instalar no Celular

**Android (Chrome)**:
1. Abra o app no Chrome
2. Menu (⋮) > "Adicionar à tela inicial"
3. Confirme

**iOS (Safari)**:
1. Abra o app no Safari
2. Toque em compartilhar
3. "Adicionar à Tela de Início"

**Desktop (Chrome/Edge)**:
1. Clique no ícone de instalação na barra de endereço
2. Ou Menu > "Instalar Se Controla"

## 🐛 Problemas?

### OAuth Error - redirect_uri_mismatch
❌ **Problema**: A URL não está nas Redirect URIs do Google

✅ **Solução**:
1. Google Cloud Console > Credentials
2. Edite o OAuth Client
3. Adicione `https://SEU-APP.vercel.app/api/auth/callback/google`
4. Salve e aguarde 1 minuto

### Database connection failed
❌ **Problema**: DATABASE_URL incorreta ou banco inacessível

✅ **Solução**:
1. Verifique se copiou a Connection String completa do Supabase
2. Confirme que incluiu o `[PASSWORD]` correto
3. Teste a conexão no Vercel: Functions > Logs

### PWA não aparece para instalar
❌ **Problema**: Ícones PNG não existem

✅ **Solução**:
1. Gere os ícones PNG (passo 1)
2. Commit e push
3. Aguarde novo deploy
4. Limpe o cache do navegador

### Service Worker não atualiza
✅ **Solução**:
1. DevTools > Application > Service Workers
2. Unregister
3. Recarregue a página

## 🎉 Pronto!

Seu app está no ar e instalável! Compartilhe a URL com amigos e família.

**URL do app**: https://seu-app.vercel.app

---

**Precisa de ajuda?** Veja o [DEPLOY.md](./DEPLOY.md) completo ou abra uma issue.
