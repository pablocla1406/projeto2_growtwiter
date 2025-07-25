import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';

export class TweetController {
  // Criar um tweet
  static async createTweet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { content } = req.body;
      const authorId = req.userId!;

      // Validações básicas
      if (!content || content.trim().length === 0) {
        res.status(400).json({ error: 'O conteúdo do tweet é obrigatório' });
        return;
      }

      if (content.length > 280) {
        res.status(400).json({ error: 'O tweet não pode ter mais de 280 caracteres' });
        return;
      }

      // Criar o tweet
      const tweet = await prisma.tweet.create({
        data: {
          content: content.trim(),
          authorId
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true
            }
          },
          _count: {
            select: {
              likes: true,
              replies: true
            }
          }
        }
      });

      const response = {
        id: tweet.id,
        content: tweet.content,
        author: tweet.author,
        createdAt: tweet.createdAt,
        likes: tweet._count.likes,
        replies: tweet._count.replies
      };

      res.status(201).json({
        message: 'Tweet criado com sucesso',
        tweet: response
      });
    } catch (error) {
      console.error('Erro ao criar tweet:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Criar um tweet de reply
  static async createReply(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { content } = req.body;
      const { id: parentId } = req.params;
      const parentTweetId = parseInt(parentId, 10);
      const authorId = req.userId!;

      // Validação do ID
      if (isNaN(parentTweetId)) {
        res.status(400).json({ error: 'ID do tweet pai inválido' });
        return;
      }

      // Validações básicas
      if (!content || content.trim().length === 0) {
        res.status(400).json({ error: 'O conteúdo da resposta é obrigatório' });
        return;
      }

      if (content.length > 280) {
        res.status(400).json({ error: 'A resposta não pode ter mais de 280 caracteres' });
        return;
      }

      // Verificar se o tweet pai existe
      const parentTweet = await prisma.tweet.findUnique({
        where: { id: parentTweetId }
      });

      if (!parentTweet) {
        res.status(404).json({ error: 'Tweet não encontrado' });
        return;
      }

      // Criar a resposta
      const reply = await prisma.tweet.create({
        data: {
          content: content.trim(),
          authorId,
          parentId: parentTweetId
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true
            }
          },
          parent: {
            select: {
              id: true,
              content: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true
                }
              }
            }
          },
          _count: {
            select: {
              likes: true,
              replies: true
            }
          }
        }
      });

      const response = {
        id: reply.id,
        content: reply.content,
        author: reply.author,
        replyingTo: reply.parent,
        createdAt: reply.createdAt,
        likes: reply._count.likes,
        replies: reply._count.replies
      };

      res.status(201).json({
        message: 'Resposta criada com sucesso',
        reply: response
      });
    } catch (error) {
      console.error('Erro ao criar resposta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Obter feed do usuário
  static async getFeed(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      // Buscar usuários que o usuário atual segue
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true }
      });

      const followingIds = following.map((f: { followingId: number }) => f.followingId);
      followingIds.push(userId); // Incluir tweets do próprio usuário

      // Buscar tweets do feed
      const tweets = await prisma.tweet.findMany({
        where: {
          authorId: { in: followingIds },
          parentId: null // Apenas tweets principais, não replies
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true
            }
          },
          likes: {
            select: {
              id: true,
              userId: true
            }
          },
          replies: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true
                }
              }
            },
            take: 3, // Mostrar apenas as 3 primeiras respostas
            orderBy: {
              createdAt: 'asc'
            }
          },
          _count: {
            select: {
              likes: true,
              replies: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      });

      // Mapear tweets com informação se o usuário curtiu
      const tweetsWithLikeInfo = tweets.map((tweet: any) => ({
        id: tweet.id,
        content: tweet.content,
        author: tweet.author,
        createdAt: tweet.createdAt,
        likes: tweet._count.likes,
        replies: tweet._count.replies,
        isLikedByUser: tweet.likes.some((like: { userId: number }) => like.userId === userId),
        recentReplies: tweet.replies
      }));

      res.json({
        tweets: tweetsWithLikeInfo,
        pagination: {
          page,
          limit,
          hasMore: tweets.length === limit
        }
      });
    } catch (error) {
      console.error('Erro ao buscar feed:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Curtir um tweet
  static async likeTweet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id: tweetId } = req.params;
      const tweetIdInt = parseInt(tweetId, 10);
      const userId = req.userId!;

      // Validação do ID
      if (isNaN(tweetIdInt)) {
        res.status(400).json({ error: 'ID do tweet inválido' });
        return;
      }

      // Verificar se o tweet existe
      const tweet = await prisma.tweet.findUnique({
        where: { id: tweetIdInt }
      });

      if (!tweet) {
        res.status(404).json({ error: 'Tweet não encontrado' });
        return;
      }

      // Verificar se já curtiu
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_tweetId: {
            userId,
            tweetId: tweetIdInt
          }
        }
      });

      if (existingLike) {
        res.status(409).json({ error: 'Você já curtiu este tweet' });
        return;
      }

      // Criar o like
      await prisma.like.create({
        data: {
          userId,
          tweetId: tweetIdInt
        }
      });

      // Buscar contagem atualizada de likes
      const likesCount = await prisma.like.count({
        where: { tweetId: tweetIdInt }
      });

      res.status(201).json({ 
        message: 'Tweet curtido com sucesso',
        likesCount
      });
    } catch (error) {
      console.error('Erro ao curtir tweet:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Remover like de um tweet
  static async unlikeTweet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id: tweetId } = req.params;
      const tweetIdInt = parseInt(tweetId, 10);
      const userId = req.userId!;

      // Validação do ID
      if (isNaN(tweetIdInt)) {
        res.status(400).json({ error: 'ID do tweet inválido' });
        return;
      }

      // Verificar se o like existe
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_tweetId: {
            userId,
            tweetId: tweetIdInt
          }
        }
      });

      if (!existingLike) {
        res.status(404).json({ error: 'Você não curtiu este tweet' });
        return;
      }

      // Remover o like
      await prisma.like.delete({
        where: {
          userId_tweetId: {
            userId,
            tweetId: tweetIdInt
          }
        }
      });

      // Buscar contagem atualizada de likes
      const likesCount = await prisma.like.count({
        where: { tweetId: tweetIdInt }
      });

      res.json({ 
        message: 'Like removido com sucesso',
        likesCount
      });
    } catch (error) {
      console.error('Erro ao remover like:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
