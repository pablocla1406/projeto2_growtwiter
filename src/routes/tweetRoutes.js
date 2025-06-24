"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var tweetController_1 = require("../controllers/tweetController");
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)();
// Todas as rotas de tweet requerem autenticação
router.use(auth_1.authenticateToken);
// POST /tweets - Criar um tweet
router.post('/', tweetController_1.TweetController.createTweet);
// POST /tweets/:id/reply - Criar um tweet de reply
router.post('/:id/reply', tweetController_1.TweetController.createReply);
// GET /tweets/feed - Obter feed do usuário
router.get('/feed', tweetController_1.TweetController.getFeed);
// POST /tweets/:id/like - Curtir um tweet
router.post('/:id/like', tweetController_1.TweetController.likeTweet);
// DELETE /tweets/:id/like - Remover like de um tweet
router.delete('/:id/like', tweetController_1.TweetController.unlikeTweet);
exports.default = router;
