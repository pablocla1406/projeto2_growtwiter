# 🚀 Guia Rápido - Como Testar a API

## Passo 1: Configuração Inicial

### 1.1 Instalar dependências
```bash
npm install
```

### 1.2 Configurar banco de dados PostgreSQL
- Instale o PostgreSQL se ainda não tiver
- Crie um banco chamado `growtwitter`
- Atualize a `DATABASE_URL` no arquivo `.env` com suas credenciais

### 1.3 Executar migrações
```bash
npm run prisma:migrate
npm run prisma:generate
```

## Passo 2: Iniciar a API
```bash
npm run dev
```

A API estará rodando em: http://localhost:3000

## Passo 3: Testar

### Opção 1: Teste Automático (Rápido)
```bash
# No terminal do Git Bash
chmod +x test_api.sh
./test_api.sh
```

### Opção 2: Postman (Recomendado)
1. Instale o Postman
2. Importe o arquivo `postman_collection.json`
3. Execute as requisições na ordem:
   - Register User
   - Login (salva o token automaticamente)
   - Create Tweet
   - Get Feed
   - Etc.

### Opção 3: Manual com cURL
```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "username": "joaosilva",
    "email": "joao@email.com",
    "password": "123456"
  }'

# 2. Fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'

# 3. Criar tweet (substitua SEU_TOKEN pelo token recebido no login)
curl -X POST http://localhost:3000/tweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "content": "Meu primeiro tweet!"
  }'
```

## 📋 Checklist Rápido
- [ ] API rodando (http://localhost:3000/health)
- [ ] Registrar usuário
- [ ] Fazer login
- [ ] Criar tweet
- [ ] Ver feed
- [ ] Curtir tweet
- [ ] Seguir usuário

## ❗ Problemas Comuns

### Erro de banco de dados:
```bash
# Verifique se o PostgreSQL está rodando
# E se as credenciais no .env estão corretas
```

### Erro 401 Unauthorized:
```bash
# Certifique-se de incluir o header:
# Authorization: Bearer SEU_TOKEN
```

### Para mais detalhes:
Veja o arquivo `API_TESTING_GUIDE.md` para instruções completas.
