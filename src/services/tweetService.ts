import { CreateReplyData, CreateTweetData, FeedResponse, FeedTweet, ReplyResponse, TweetResponse } from "../interfaces/ITwitter";
import { prisma } from "../utils/prisma";

export class TweetService {
  static async createTweet(tweetData: CreateTweetData): Promise<TweetResponse> {
    const { content, authorId } = tweetData;

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

    return {
      id: tweet.id,
      content: tweet.content,
      author: tweet.author,
      createdAt: tweet.createdAt,
      likes: tweet._count.likes,
      replies: tweet._count.replies
    };
  }

  static async createReply(replyData: CreateReplyData): Promise<ReplyResponse> {
    const { content, authorId, parentId } = replyData;

    // Verificar se o tweet pai existe
    const parentTweet = await prisma.tweet.findUnique({
      where: { id: parentId }
    });

    if (!parentTweet) {
      throw new Error('Tweet não encontrado');
    }

    // Criar a resposta
    const reply = await prisma.tweet.create({
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
      replyingTo: reply.parent!,
      createdAt: reply.createdAt,
      likes: reply._count.likes,
      replies: reply._count.replies
    };
  }

  static async getFeed(userId: number, page: number = 1, limit: number = 20): Promise<FeedResponse> {
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
    const tweetsWithLikeInfo: FeedTweet[] = tweets.map((tweet: any) => ({
      id: tweet.id,
      content: tweet.content,
      author: tweet.author,
      createdAt: tweet.createdAt,
      likes: tweet._count.likes,
      replies: tweet._count.replies,
      isLikedByUser: tweet.likes.some((like: { userId: number }) => like.userId === userId),
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

  static async likeTweet(userId: number, tweetId: number): Promise<number> {
    // Verificar se o tweet existe
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId }
    });

    if (!tweet) {
      throw new Error('Tweet não encontrado');
    }

    // Verificar se já curtiu
    const existingLike = await prisma.like.findUnique({
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
    await prisma.like.create({
      data: {
        userId,
        tweetId
      }
    });

    // Buscar contagem atualizada de likes
    const likesCount = await prisma.like.count({
      where: { tweetId }
    });

    return likesCount;
  }

  static async unlikeTweet(userId: number, tweetId: number): Promise<number> {
    // Verificar se o like existe
    const existingLike = await prisma.like.findUnique({
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
    await prisma.like.delete({
      where: {
        userId_tweetId: {
          userId,
          tweetId
        }
      }
    });

    // Buscar contagem atualizada de likes
    const likesCount = await prisma.like.count({
      where: { tweetId }
    });

    return likesCount;
  }
}
