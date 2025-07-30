import { Response } from 'express';
import { UserService } from '../services/userService';
import { AuthenticatedRequest } from '../middlewares/auth';

export class UserController {
  static async getUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        res.status(400).json({ error: 'ID de usuário inválido' });
        return;
      }

      const user = await UserService.getUserById(userId);

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async followUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id: followingId } = req.params;
      const followingUserId = parseInt(followingId, 10);
      const followerId = req.userId!;

      if (isNaN(followingUserId)) {
        res.status(400).json({ error: 'ID de usuário inválido' });
        return;
      }

      await UserService.followUser(followerId, followingUserId);

      res.status(201).json({ message: 'Usuário seguido com sucesso' });
    } catch (error) {
      console.error('Erro ao seguir usuário:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Você não pode seguir a si mesmo') {
          res.status(400).json({ error: error.message });
          return;
        }
        if (error.message === 'Usuário não encontrado') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message === 'Você já está seguindo este usuário') {
          res.status(409).json({ error: error.message });
          return;
        }
      }
      
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async unfollowUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id: followingId } = req.params;
      const followingUserId = parseInt(followingId, 10);
      const followerId = req.userId!;

      if (isNaN(followingUserId)) {
        res.status(400).json({ error: 'ID de usuário inválido' });
        return;
      }

      await UserService.unfollowUser(followerId, followingUserId);

      res.json({ message: 'Você deixou de seguir este usuário' });
    } catch (error) {
      console.error('Erro ao deixar de seguir usuário:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Você não está seguindo este usuário') {
          res.status(404).json({ error: error.message });
          return;
        }
      }
      
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
