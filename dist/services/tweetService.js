"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetService = void 0;
const prisma_1 = require("../utils/prisma");
class TweetService {
    static async createTweet(tweetData) {
        const { content, authorId } = tweetData;
        // Criar o tweet
        const tweet = await prisma_1.prisma.tweet.create({
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
        return {
            id: tweet.id,
            content: tweet.content,
            author: tweet.author,
            createdAt: tweet.createdAt,
            likes: tweet._count.likes,
            replies: tweet._count.replies
        };
    }
    static async createReply(replyData) {
        const { content, authorId, parentId } = replyData;
        // Verificar se o tweet pai existe
        const parentTweet = await prisma_1.prisma.tweet.findUnique({
            where: { id: parentId }
        });
        if (!parentTweet) {
            throw new Error('Tweet não encontrado');
        }
        // Criar a resposta
        const reply = await prisma_1.prisma.tweet.create({
            data: {
                content: content.trim(),
                authorId,
                parentId
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
        return {
            id: reply.id,
            content: reply.content,
            author: reply.author,
            replyingTo: reply.parent,
            createdAt: reply.createdAt,
            likes: reply._count.likes,
            replies: reply._count.replies
        };
    }
    static async getFeed(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        // Buscar usuários que o usuário atual segue
        const following = await prisma_1.prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true }
        });
        const followingIds = following.map((f) => f.followingId);
        followingIds.push(userId); // Incluir tweets do próprio usuário
        // Buscar tweets do feed
        const tweets = await prisma_1.prisma.tweet.findMany({
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
        const tweetsWithLikeInfo = tweets.map((tweet) => ({
            id: tweet.id,
            content: tweet.content,
            author: tweet.author,
            createdAt: tweet.createdAt,
            likes: tweet._count.likes,
            replies: tweet._count.replies,
            isLikedByUser: tweet.likes.some((like) => like.userId === userId),
            recentReplies: tweet.replies
        }));
        return {
            tweets: tweetsWithLikeInfo,
            pagination: {
                page,
                limit,
                hasMore: tweets.length === limit
            }
        };
    }
    static async likeTweet(userId, tweetId) {
        // Verificar se o tweet existe
        const tweet = await prisma_1.prisma.tweet.findUnique({
            where: { id: tweetId }
        });
        if (!tweet) {
            throw new Error('Tweet não encontrado');
        }
        // Verificar se já curtiu
        const existingLike = await prisma_1.prisma.like.findUnique({
            where: {
                userId_tweetId: {
                    userId,
                    tweetId
                }
            }
        });
        if (existingLike) {
            throw new Error('Você já curtiu este tweet');
        }
        // Criar o like
        await prisma_1.prisma.like.create({
            data: {
                userId,
                tweetId
            }
        });
        // Buscar contagem atualizada de likes
        const likesCount = await prisma_1.prisma.like.count({
            where: { tweetId }
        });
        return likesCount;
    }
    static async unlikeTweet(userId, tweetId) {
        // Verificar se o like existe
        const existingLike = await prisma_1.prisma.like.findUnique({
            where: {
                userId_tweetId: {
                    userId,
                    tweetId
                }
            }
        });
        if (!existingLike) {
            throw new Error('Você não curtiu este tweet');
        }
        // Remover o like
        await prisma_1.prisma.like.delete({
            where: {
                userId_tweetId: {
                    userId,
                    tweetId
                }
            }
        });
        // Buscar contagem atualizada de likes
        const likesCount = await prisma_1.prisma.like.count({
            where: { tweetId }
        });
        return likesCount;
    }
}
exports.TweetService = TweetService;
