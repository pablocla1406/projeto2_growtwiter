import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoute';

config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Registrar rotas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tweets', tweetRoutes);


// 404 handler (deve ser a última rota)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

export default app;
