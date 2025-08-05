import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getUser);

router.post('/:id/follow', UserController.followUser);

router.delete('/:id/follow', UserController.unfollowUser);

export default router;
