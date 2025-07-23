# Guia de Testes - API Growtwitter

Este documento contém todas as rotas da API e exemplos de como testá-las.

## Configuração Base
- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`

## 📋 Índice
1. [Autenticação](#autenticação)
2. [Usuários](#usuários)
3. [Tweets](#tweets)

---

## 🔐 Autenticação

### 1. Registrar Usuário
**POST** `/auth/register`

**Exemplo de Request:**
```json
{
  "name": "João Silva",
  "username": "joaosilva",
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

**Como testar no cURL:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "username": "joaosilva",
    "email": "joao@email.com",
    "password": "minhasenha123"
  }'
```

### 2. Login
**POST** `/auth/login`

**Exemplo de Request:**
```json
{
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

**Como testar no cURL:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "minhasenha123"
  }'
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "João Silva",
    "username": "joaosilva",
    "email": "joao@email.com"
  }
}
```

⚠️ **IMPORTANTE**: Salve o token retornado! Você precisará dele para todas as outras rotas.

---

## 👤 Usuários
*Todas as rotas de usuário requerem autenticação*

### 3. Obter Dados de um Usuário
**GET** `/users/:id`

**Como testar no cURL:**
```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 4. Seguir um Usuário
**POST** `/users/:id/follow`

**Como testar no cURL:**
```bash
curl -X POST http://localhost:3000/users/2/follow \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 5. Deixar de Seguir um Usuário
**DELETE** `/users/:id/follow`

**Como testar no cURL:**
```bash
curl -X DELETE http://localhost:3000/users/2/follow \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🐦 Tweets
*Todas as rotas de tweet requerem autenticação*

### 6. Criar um Tweet
**POST** `/tweets`

**Exemplo de Request:**
```json
{
  "content": "Meu primeiro tweet! 🎉"
}
```

**Como testar no cURL:**
```bash
curl -X POST http://localhost:3000/tweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "content": "Meu primeiro tweet! 🎉"
  }'
```

### 7. Criar uma Resposta (Reply)
**POST** `/tweets/:id/reply`

**Exemplo de Request:**
```json
{
  "content": "Que legal! Parabéns pelo tweet!"
}
```

**Como testar no cURL:**
```bash
curl -X POST http://localhost:3000/tweets/1/reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "content": "Que legal! Parabéns pelo tweet!"
  }'
```

### 8. Obter Feed do Usuário
**GET** `/tweets/feed`

**Como testar no cURL:**
```bash
curl -X GET http://localhost:3000/tweets/feed \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 9. Curtir um Tweet
**POST** `/tweets/:id/like`

**Como testar no cURL:**
```bash
curl -X POST http://localhost:3000/tweets/1/like \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 10. Remover Like de um Tweet
**DELETE** `/tweets/:id/like`

**Como testar no cURL:**
```bash
curl -X DELETE http://localhost:3000/tweets/1/like \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🧪 Fluxo de Teste Completo

### Passo 1: Iniciar o servidor
```bash
npm run dev
```

### Passo 2: Registrar dois usuários
```bash
# Usuário 1
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "username": "joaosilva",
    "email": "joao@email.com",
    "password": "senha123"
  }'

# Usuário 2
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "username": "mariasantos",
    "email": "maria@email.com",
    "password": "senha123"
  }'
```

### Passo 3: Fazer login e obter tokens
```bash
# Login do João
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

### Passo 4: Testar funcionalidades
1. Criar tweets
2. Seguir usuários
3. Curtir tweets
4. Criar replies
5. Ver feed

---

## 🛠️ Testando com Postman

### Configuração do Environment:
- **base_url**: `http://localhost:3000`
- **token**: (será preenchido após o login)

### Headers para rotas autenticadas:
- **Authorization**: `Bearer {{token}}`
- **Content-Type**: `application/json`

---

## ❌ Códigos de Erro Comuns

- **400**: Bad Request - Dados inválidos
- **401**: Unauthorized - Token inválido ou ausente
- **404**: Not Found - Recurso não encontrado
- **409**: Conflict - Recurso já existe (ex: email já cadastrado)
- **500**: Internal Server Error - Erro interno do servidor

---

## 📝 Notas Importantes

1. **Token JWT**: Expira em 7 dias. Depois disso, faça login novamente.
2. **IDs**: Os IDs dos usuários e tweets são gerados automaticamente.
3. **Validações**: A API valida todos os dados de entrada.
4. **Seguir a si mesmo**: Não é permitido seguir a si mesmo.
5. **Curtir o próprio tweet**: É permitido curtir seus próprios tweets.

---

## 🔄 Exemplos de Resposta

### Sucesso ao criar tweet:
```json
{
  "id": "1",
  "content": "Meu primeiro tweet! 🎉",
  "authorId": "1",
  "createdAt": "2025-07-23T10:30:00.000Z"
}
```

### Feed do usuário:
```json
{
  "tweets": [
    {
      "id": "1",
      "content": "Meu primeiro tweet! 🎉",
      "author": {
        "id": "1",
        "name": "João Silva",
        "username": "joaosilva"
      },
      "createdAt": "2025-07-23T10:30:00.000Z",
      "likes": 5,
      "replies": 2
    }
  ]
}
```
