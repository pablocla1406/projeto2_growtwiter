import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, username, email, password } = req.body;

      if (!name || !username || !email || !password) {
        res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
        return;
      }

      const result = await AuthService.register({ name, username, email, password });

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Username ou email já estão em uso') {
          res.status(409).json({ error: error.message });
          return;
        }
      }
      
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        res.status(400).json({ error: 'Login e senha são obrigatórios' });
        return;
      }

      const result = await AuthService.login({ login, password });

      res.json({
        message: 'Login realizado com sucesso',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Credenciais inválidas') {
          res.status(401).json({ error: error.message });
          return;
        }
      }
      
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
