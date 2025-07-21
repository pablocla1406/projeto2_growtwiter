import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

// POST /auth/register - Cadastrar novo usuário
router.post('/register', AuthController.register);

// POST /auth/login - Fazer login
router.post('/login', AuthController.login);

export default router;
