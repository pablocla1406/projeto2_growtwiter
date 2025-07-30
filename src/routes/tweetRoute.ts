import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { TweetController } from '../controllers/tweetController';

const router = Router();

router.use(authenticateToken);

router.post('/', TweetController.createTweet);

router.post('/:id/reply', TweetController.createReply);

router.get('/feed', TweetController.getFeed);

router.post('/:id/like', TweetController.likeTweet);

router.delete('/:id/like', TweetController.unlikeTweet);

export default router;
