"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetController = void 0;
const tweetService_1 = require("../services/tweetService");
class TweetController {
    static async createTweet(req, res) {
        try {
            const { content } = req.body;
            const authorId = req.userId;
            if (!content || content.trim().length === 0) {
                res.status(400).json({ error: 'O conteúdo do tweet é obrigatório' });
                return;
            }
            if (content.length > 280) {
                res.status(400).json({ error: 'O tweet não pode ter mais de 280 caracteres' });
                return;
            }
            const tweet = await tweetService_1.TweetService.createTweet({ content, authorId });
            res.status(201).json({
                message: 'Tweet criado com sucesso',
                tweet
            });
        }
        catch (error) {
            console.error('Erro ao criar tweet:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    static async createReply(req, res) {
        try {
            const { content } = req.body;
            const { id: parentId } = req.params;
            const parentTweetId = parseInt(parentId, 10);
            const authorId = req.userId;
            if (isNaN(parentTweetId)) {
                res.status(400).json({ error: 'ID do tweet pai inválido' });
                return;
            }
            if (!content || content.trim().length === 0) {
                res.status(400).json({ error: 'O conteúdo da resposta é obrigatório' });
                return;
            }
            if (content.length > 280) {
                res.status(400).json({ error: 'A resposta não pode ter mais de 280 caracteres' });
                return;
            }
            const reply = await tweetService_1.TweetService.createReply({ content, authorId, parentId: parentTweetId });
            res.status(201).json({
                message: 'Resposta criada com sucesso',
                reply
            });
        }
        catch (error) {
            console.error('Erro ao criar resposta:', error);
            if (error instanceof Error) {
                if (error.message === 'Tweet não encontrado') {
                    res.status(404).json({ error: error.message });
                    return;
                }
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    static async getFeed(req, res) {
        try {
            const userId = req.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const feed = await tweetService_1.TweetService.getFeed(userId, page, limit);
            res.json(feed);
        }
        catch (error) {
            console.error('Erro ao buscar feed:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    static async likeTweet(req, res) {
        try {
            const { id: tweetId } = req.params;
            const tweetIdInt = parseInt(tweetId, 10);
            const userId = req.userId;
            if (isNaN(tweetIdInt)) {
                res.status(400).json({ error: 'ID do tweet inválido' });
                return;
            }
            const likesCount = await tweetService_1.TweetService.likeTweet(userId, tweetIdInt);
            res.status(201).json({
                message: 'Tweet curtido com sucesso',
                likesCount
            });
        }
        catch (error) {
            console.error('Erro ao curtir tweet:', error);
            if (error instanceof Error) {
                if (error.message === 'Tweet não encontrado') {
                    res.status(404).json({ error: error.message });
                    return;
                }
                if (error.message === 'Você já curtiu este tweet') {
                    res.status(409).json({ error: error.message });
                    return;
                }
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    static async unlikeTweet(req, res) {
        try {
            const { id: tweetId } = req.params;
            const tweetIdInt = parseInt(tweetId, 10);
            const userId = req.userId;
            if (isNaN(tweetIdInt)) {
                res.status(400).json({ error: 'ID do tweet inválido' });
                return;
            }
            const likesCount = await tweetService_1.TweetService.unlikeTweet(userId, tweetIdInt);
            res.json({
                message: 'Like removido com sucesso',
                likesCount
            });
        }
        catch (error) {
            console.error('Erro ao remover like:', error);
            if (error instanceof Error) {
                if (error.message === 'Você não curtiu este tweet') {
                    res.status(404).json({ error: error.message });
                    return;
                }
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.TweetController = TweetController;
