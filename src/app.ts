import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';

// Importar rotas
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';

// Configurar variáveis de ambiente
config();

const app = express();

// Middlewares de segurança e logging
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tweets', tweetRoutes);

// Rota de health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

export default app;
