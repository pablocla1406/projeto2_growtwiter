# 🐦 Growtwitter API

Uma API REST completa para uma rede social similar ao Twitter, desenvolvida com Node.js, TypeScript, Express e PostgreSQL.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript  
- **Express.js** - Framework web para Node.js
- **PostgreSQL** - Banco de dados relacional
- **Prisma ORM** - ORM moderno para Node.js e TypeScript
- **JWT** - Autenticação via JSON Web Tokens
- **bcryptjs** - Hash seguro de senhas
- **CORS** - Habilitação de requests cross-origin
- **Helmet** - Middleware de segurança HTTP
- **Morgan** - Logging de requests HTTP

## 📋 Funcionalidades

### 👤 Usuários
- ✅ Registro de novos usuários
- ✅ Login com username ou email
- ✅ Autenticação via JWT
- ✅ Perfil com imagem (URL)
- ✅ Sistema de seguidores/seguindo
- ✅ Validação: usuário não pode seguir a si mesmo
- ✅ Listagem de todos os usuários

### 🐦 Tweets
- ✅ Criar tweets (máximo 280 caracteres)
- ✅ Curtir/descurtir tweets (próprios e de outros)
- ✅ Responder tweets (replies aninhadas)
- ✅ Feed personalizado baseado em quem você segue
- ✅ Contagem de likes e replies em tempo real

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (v16 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/pablocla1406/projeto2_growtwiter.git
cd projeto2_growtwiter
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/growtwitter_db"

# JWT Secret (use uma string segura em produção)
JWT_SECRET="seu_jwt_secret_muito_seguro_aqui_com_pelo_menos_32_caracteres"

# Server Port
PORT=3000

```

### 4. Configure o banco de dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate deploy

# (Opcional) Visualizar banco de dados
npx prisma studio
```

### 5. Execute a aplicação

**Desenvolvimento:**
```bash
npm run dev
```

**Build para produção:**
```bash
npm run build
npm start
```

A API estará rodando em `http://localhost:3000`

## 📚 Documentação da API

### 🔐 Autenticação

#### Registrar usuário
```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "username": "joao123",
  "email": "joao@email.com", 
  "password": "senha123",
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "login": "joao123", // username ou email
  "password": "senha123"
}
```

### 👥 Usuários

#### Listar todos os usuários
```http
GET /users
Authorization: Bearer <token>
```

#### Buscar usuário por ID
```http
GET /users/:id
Authorization: Bearer <token>
```

#### Seguir usuário
```http
POST /users/:id/follow
Authorization: Bearer <token>
```

#### Deixar de seguir usuário
```http
DELETE /users/:id/follow
Authorization: Bearer <token>
```

### 🐦 Tweets

#### Feed personalizado
```http
GET /tweets/feed
Authorization: Bearer <token>
```

#### Criar tweet
```http
POST /tweets
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Meu primeiro tweet no Growtwitter! 🚀"
}
```

#### Responder tweet
```http
POST /tweets/:id/reply
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Excelente tweet! Concordo totalmente."
}
```

#### Curtir tweet
```http
POST /tweets/:id/like
Authorization: Bearer <token>
```

#### Descurtir tweet
```http
DELETE /tweets/:id/like
Authorization: Bearer <token>
```

### 📊 Sistema

#### Health Check
```http
GET /health
```

## 📁 Estrutura do Projeto

```
projeto_growtwitter/
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── migrations/        # Migrações do banco
├── src/
│   ├── controllers/       # Controladores da API
│   │   ├── authController.ts
│   │   ├── tweetController.ts
│   │   └── userController.ts
│   ├── interfaces/        # Interfaces TypeScript
│   │   ├── IAuthenticatedRequest.ts
│   │   ├── ILogin.ts
│   │   ├── ITwitter.ts
│   │   └── IUser.ts
│   ├── middlewares/       # Middlewares personalizados
│   │   └── auth.ts        # Middleware de autenticação
│   ├── routes/           # Definição das rotas
│   │   ├── authRoutes.ts
│   │   ├── tweetRoute.ts
│   │   └── userRoutes.ts
│   ├── services/         # Lógica de negócio
│   │   ├── authService.ts
│   │   ├── tweetService.ts
│   │   ├── userService.ts
│   │   └── index.ts
│   ├── utils/            # Utilitários
│   │   ├── auth.ts       # Funções JWT e hash
│   │   └── prisma.ts     # Cliente Prisma
│   ├── app.ts            # Configuração do Express
│   └── server.ts         # Inicialização do servidor
├── package.json
├── tsconfig.json
└── README.md
```

## 🗃️ Modelo de Dados

### User (Usuário)
```typescript
{
  id: number
  name: string
  username: string       // único
  email: string         // único  
  password: string      // hash bcrypt
  createdAt: Date
  updatedAt: Date
}
```

**Relacionamentos:**
- `tweets[]` - Tweets do usuário
- `likes[]` - Likes dados pelo usuário
- `followers[]` - Usuários que seguem este usuário
- `following[]` - Usuários que este usuário segue

### Tweet
```typescript
{
  id: number
  content: string       // máximo 280 caracteres
  authorId: number     // FK para User
  parentId?: number    // FK para Tweet (replies)
  createdAt: Date
  updatedAt: Date
}
```

**Relacionamentos:**
- `author` - Usuário autor do tweet
- `likes[]` - Likes recebidos
- `parent?` - Tweet pai (se for reply)
- `replies[]` - Respostas ao tweet

### Like
```typescript
{
  id: number
  userId: number       // FK para User
  tweetId: number     // FK para Tweet
  createdAt: Date
}
```

### Follow
```typescript
{
  id: number
  followerId: number   // FK para User (quem segue)
  followingId: number  // FK para User (quem é seguido)
  createdAt: Date
}
```


### Formato do Token JWT
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 Deploy

Este projeto está preparado para deploy nas seguintes plataformas:

### Render (Recomendado)
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Vercel
1. Instale a CLI do Vercel
2. Configure `vercel.json` para APIs
3. Deploy com `vercel --prod`

### Railway
1. Conecte repositório
2. Configure PostgreSQL addon
3. Deploy automático

### Variáveis de ambiente necessárias:
- `DATABASE_URL` - String de conexão PostgreSQL
- `JWT_SECRET` - Chave secreta para JWT (mín. 32 caracteres)
- `PORT` - Porta do servidor (opcional, padrão: 3000)
- `NODE_ENV` - Ambiente (production/development)

## 📊 Scripts Disponíveis

```bash
npm run dev      # Execução em desenvolvimento (ts-node)
npm run build    # Compilação TypeScript
npm start        # Execução em produção (Node.js)
npm test         # Execução dos testes (não implementado)
```

## 📝 Exemplos de Uso

### Fluxo completo de um usuário:

#### 1. Registrar conta
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "username": "maria_dev", 
    "email": "maria@email.com",
    "password": "senha123",
    "profileImage": "https://avatar.com/maria.jpg"
  }'
```

#### 2. Fazer login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "maria_dev",
    "password": "senha123"
  }'
```

#### 3. Criar tweet
```bash
curl -X POST http://localhost:3000/tweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "content": "Acabei de me cadastrar no Growtwitter! 🎉"
  }'
```

#### 4. Seguir outro usuário
```bash
curl -X POST http://localhost:3000/users/1/follow \
  -H "Authorization: Bearer SEU_TOKEN"
```

#### 5. Ver feed personalizado
```bash
curl -X GET "http://localhost:3000/tweets/feed?page=1&limit=10" \
  -H "Authorization: Bearer SEU_TOKEN"
```




### Erro de conexão com banco
- Verifique se PostgreSQL está rodando
- Confirme a string `DATABASE_URL` no `.env`
- Execute `npx prisma migrate deploy`

### Token inválido
- Verifique se o header Authorization está correto
- Confirme se o JWT_SECRET está configurado

### Erro de CORS
- Configure origins permitidas no `app.ts`
- Verifique se o frontend está na origem correta



## 👨‍💻 Desenvolvedor

**Pablo** - [GitHub](https://github.com/pablocla1406)


## 🙏 Agradecimentos

- Growdev pela oportunidade de aprendizado
- Comunidade open source pelas ferramentas incríveis
- Colegas desenvolvedores pelas dicas e suporte

---

⭐ **Se este projeto te ajudou, considere dar uma estrela no GitHub!**

🔗 **Links importantes:**
- [Repositório GitHub](https://github.com/pablocla1406/projeto2_growtwiter)
- [Deploy da API](#) *(https://projeto2-growtwiter.onrender.com)*
- [Documentação Prisma](https://prisma.io/docs)
- [Express.js Docs](https://expressjs.com/)


