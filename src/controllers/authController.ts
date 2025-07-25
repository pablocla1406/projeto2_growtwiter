import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthUtils } from '../utils/auth';

export class AuthController {
  // Cadastrar novo usuário
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, username, email, password } = req.body;

      // Validações básicas
      if (!name || !username || !email || !password) {
        res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
        return;
      }

      // Verificar se username ou email já existem
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        res.status(409).json({ error: 'Username ou email já estão em uso' });
        return;
      }

      // Hash da senha
      const hashedPassword = await AuthUtils.hashPassword(password);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          createdAt: true
        }
      });

      // Gerar token
      const token = AuthUtils.generateToken(user.id);

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user,
        token
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Fazer login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { login, password } = req.body;

      // Validações básicas
      if (!login || !password) {
        res.status(400).json({ error: 'Login e senha são obrigatórios' });
        return;
      }

      // Buscar usuário por username ou email
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: login },
            { email: login }
          ]
        }
      });

      if (!user) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      // Verificar senha
      const isPasswordValid = await AuthUtils.comparePassword(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      // Gerar token
      const token = AuthUtils.generateToken(user.id);

      res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
