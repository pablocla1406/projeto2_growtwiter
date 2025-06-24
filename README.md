# Growtwitter API

Uma API REST para uma plataforma de mídia social similar ao Twitter, desenvolvida com Node.js, TypeScript, Express.js, PostgreSQL e Prisma ORM.

## 🚀 Funcionalidades

- **Autenticação de usuários** (cadastro e login)
- **Sistema de tweets** (criação e replies)
- **Sistema de seguidores** (seguir e deixar de seguir)
- **Sistema de likes** (curtir e descurtir tweets)
- **Feed personalizado** (tweets do usuário e de quem ele segue)

## 🛠️ Tecnologias

- **Node.js** com **TypeScript**
- **Express.js** para criação da API REST
- **PostgreSQL** como banco de dados
- **Prisma ORM** para manipulação do banco de dados
- **JWT** para autenticação
- **bcryptjs** para hash de senhas

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL
- npm ou yarn

## ⚙️ Configuração

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd growtwitter-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/growtwitter?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

4. **Configure o banco de dados**
```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio
npm run prisma:studio
```

## 🚀 Como executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📚 Rotas da API

### Autenticação (Não requer token)

- `POST /auth/register` - Cadastrar novo usuário
- `POST /auth/login` - Fazer login

### Usuários (Requer autenticação)

- `GET /users/:id` - Obter dados de um usuário
- `POST /users/:id/follow` - Seguir um usuário
- `DELETE /users/:id/follow` - Deixar de seguir um usuário

### Tweets (Requer autenticação)

- `POST /tweets` - Criar um tweet
- `POST /tweets/:id/reply` - Criar reply para um tweet
- `GET /tweets/feed` - Obter feed do usuário
- `POST /tweets/:id/like` - Curtir um tweet
- `DELETE /tweets/:id/like` - Descurtir um tweet

### Health Check

- `GET /health` - Verificar status da API

## 📝 Exemplos de uso

### Cadastrar usuário
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "username": "joaosilva",
  "email": "joao@email.com",
  "password": "minhasenha123",
  "profileImage": "https://example.com/avatar.jpg"
}
```

### Fazer login
```bash
POST /auth/login
Content-Type: application/json

{
  "login": "joaosilva", // ou email
  "password": "minhasenha123"
}
```

### Criar tweet
```bash
POST /tweets
Authorization: Bearer <seu-token>
Content-Type: application/json

{
  "content": "Meu primeiro tweet!"
}
```

## 🗄️ Estrutura do banco de dados

### User
- id, name, username (único), email (único), password, profileImage
- Relacionamentos: tweets, likes, followers, following

### Tweet
- id, content, authorId, parentId (para replies)
- Relacionamentos: author, likes, parent, replies

### Like
- id, userId, tweetId
- Relacionamentos: user, tweet

### Follow
- id, followerId, followingId
- Relacionamentos: follower, following

## 🔧 Scripts disponíveis

- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Executar versão compilada
- `npm run prisma:generate` - Gerar cliente Prisma
- `npm run prisma:migrate` - Executar migrações
- `npm run prisma:push` - Sincronizar schema com o banco
- `npm run prisma:studio` - Abrir Prisma Studio

## 📄 Licença

Este projeto está sob a licença ISC.
