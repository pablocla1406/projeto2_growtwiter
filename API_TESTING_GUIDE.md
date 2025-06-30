# Guia de Testes - Growtwitter API

## 🚀 Como Executar a API

### 1. Configuração Inicial

#### Instalar dependências:
```bash
npm install
```

#### Configurar banco de dados:
1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure sua string de conexão PostgreSQL no arquivo `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/growtwitter?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

#### Executar migrações do banco:
```bash
npm run prisma:migrate
npm run prisma:generate
```

#### Iniciar a aplicação:
```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Ou modo produção
npm run build
npm start
```

A API estará rodando em: `http://localhost:3000`

---

## 🧪 Testes das Rotas

### Base URL: `http://localhost:3000`

## 1. Cadastrar Usuário
**POST** `/auth/register`

```json
{
  "name": "João Silva",
  "username": "joaosilva",
  "email": "joao@email.com",
  "password": "123456",
  "profileImage": "https://example.com/avatar.jpg"
}
```

**Resposta esperada:**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "user_id",
    "name": "João Silva",
    "username": "joaosilva",
    "email": "joao@email.com",
    "profileImage": "https://example.com/avatar.jpg",
    "createdAt": "2025-06-24T..."
  }
}
```

## 2. Login
**POST** `/auth/login`

```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta esperada:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "João Silva",
    "username": "joaosilva",
    "email": "joao@email.com"
  }
}
```

> ⚠️ **IMPORTANTE**: Copie o `token` retornado! Ele será necessário para todas as próximas requisições.

---

## 🔐 Rotas com Autenticação

Para todas as rotas abaixo, adicione o header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

## 3. Obter Dados de um Usuário
**GET** `/users/:id`

**Resposta esperada:**
```json
{
  "user": {
    "id": "user_id",
    "name": "João Silva",
    "username": "joaosilva",
    "email": "joao@email.com",
    "profileImage": "https://example.com/avatar.jpg",
    "createdAt": "2025-06-24T...",
    "tweets": [...],
    "followers": [...],
    "following": [...],
    "_count": {
      "tweets": 0,
      "followers": 0,
      "following": 0
    }
  }
}
```

## 4. Criar Tweet
**POST** `/tweets`

```json
{
  "content": "Meu primeiro tweet no Growtwitter! 🚀"
}
```

**Resposta esperada:**
```json
{
  "message": "Tweet criado com sucesso",
  "tweet": {
    "id": "tweet_id",
    "content": "Meu primeiro tweet no Growtwitter! 🚀",
    "createdAt": "2025-06-24T...",
    "author": {
      "id": "user_id",
      "name": "João Silva",
      "username": "joaosilva",
      "profileImage": "https://example.com/avatar.jpg"
    },
    "_count": {
      "likes": 0,
      "replies": 0
    }
  }
}
```

## 5. Criar Reply
**POST** `/tweets/:id/reply`

```json
{
  "content": "Ótimo tweet! Concordo totalmente."
}
```

## 6. Obter Feed
**GET** `/tweets/feed`

**Resposta esperada:**
```json
{
  "feed": [
    {
      "id": "tweet_id",
      "content": "Conteúdo do tweet",
      "createdAt": "2025-06-24T...",
      "author": {...},
      "likes": [...],
      "_count": {
        "likes": 5,
        "replies": 2
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

## 7. Curtir Tweet
**POST** `/tweets/:id/like`

**Resposta esperada:**
```json
{
  "message": "Tweet curtido com sucesso"
}
```

## 8. Descurtir Tweet
**DELETE** `/tweets/:id/like`

**Resposta esperada:**
```json
{
  "message": "Like removido com sucesso"
}
```

## 9. Seguir Usuário
**POST** `/users/:id/follow`

**Resposta esperada:**
```json
{
  "message": "Usuário seguido com sucesso"
}
```

## 10. Deixar de Seguir
**DELETE** `/users/:id/follow`

**Resposta esperada:**
```json
{
  "message": "Usuário deixou de ser seguido"
}
```

---

## 🛠️ Ferramentas para Teste

### 1. **Postman** (Recomendado)
- Baixe em: https://www.postman.com/
- Importe a collection que criei (veja arquivo `postman_collection.json`)

### 2. **Thunder Client** (Extensão VS Code)
- Instale a extensão no VS Code
- Ideal para testar diretamente no editor

### 3. **cURL** (Linha de comando)
Exemplo de teste com cURL:

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

# 3. Criar tweet (substitua SEU_TOKEN)
curl -X POST http://localhost:3000/tweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "content": "Meu primeiro tweet!"
  }'
```

---

## ✅ Checklist de Testes

- [ ] Cadastrar usuário
- [ ] Fazer login
- [ ] Obter dados do usuário
- [ ] Criar tweet
- [ ] Criar reply
- [ ] Obter feed
- [ ] Curtir tweet
- [ ] Descurtir tweet
- [ ] Seguir usuário
- [ ] Deixar de seguir usuário

---

## 🐛 Resolução de Problemas

### Erro de conexão com banco:
- Verifique se o PostgreSQL está rodando
- Confirme a string de conexão no `.env`
- Execute as migrações: `npm run prisma:migrate`

### Erro 401 (Unauthorized):
- Verifique se o token JWT está sendo enviado no header
- Confirme se o token não expirou

### Erro 404 (Not Found):
- Verifique se a URL está correta
- Confirme se o ID do usuário/tweet existe

### Para ver logs detalhados:
```bash
npm run dev
```

---

## 🎯 Próximos Passos

1. Execute todos os testes básicos
2. Teste cenários de erro (dados inválidos, usuários inexistentes, etc.)
3. Teste a paginação do feed
4. Verifique as validações de entrada
5. Teste com múltiplos usuários para simular interações reais
