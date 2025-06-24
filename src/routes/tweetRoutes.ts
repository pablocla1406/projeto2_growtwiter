import { Router } from 'express';
import { TweetController } from '../controllers/tweetController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Todas as rotas de tweet requerem autenticação
router.use(authenticateToken);

// POST /tweets - Criar um tweet
router.post('/', TweetController.createTweet);

// POST /tweets/:id/reply - Criar um tweet de reply
router.post('/:id/reply', TweetController.createReply);

// GET /tweets/feed - Obter feed do usuário
router.get('/feed', TweetController.getFeed);

// POST /tweets/:id/like - Curtir um tweet
router.post('/:id/like', TweetController.likeTweet);

// DELETE /tweets/:id/like - Remover like de um tweet
router.delete('/:id/like', TweetController.unlikeTweet);

module.exports = router;
