import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Todas as rotas de usuário requerem autenticação
router.use(authenticateToken);

// GET /users/:id - Obter dados de um usuário
router.get('/:id', UserController.getUser);

// POST /users/:id/follow - Seguir um usuário
router.post('/:id/follow', UserController.followUser);

// DELETE /users/:id/follow - Deixar de seguir um usuário
router.delete('/:id/follow', UserController.unfollowUser);

export default router;
