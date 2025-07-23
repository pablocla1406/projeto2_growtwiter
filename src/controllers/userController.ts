import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';

export class UserController {
  // Obter dados de um usuário
  static async getUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          profileImage: true,
          createdAt: true,
          tweets: {
            select: {
              id: true,
              content: true,
              createdAt: true,
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
                      username: true,
                      profileImage: true
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
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          followers: {
            select: {
              follower: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  profileImage: true
                }
              }
            }
          },
          following: {
            select: {
              following: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  profileImage: true
                }
              }
            }
          },
          _count: {
            select: {
              tweets: true,
              followers: true,
              following: true
            }
          }
        }
      });

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json({
        user: {
          ...user,
          followers: user.followers.map((f: any) => f.follower),
          following: user.following.map((f: any) => f.following)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Seguir um usuário
  static async followUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id: followingId } = req.params;
      const followerId = req.userId!;

      // Verificar se não está tentando seguir a si mesmo
      if (followerId === followingId) {
        res.status(400).json({ error: 'Você não pode seguir a si mesmo' });
        return;
      }

      // Verificar se o usuário a ser seguido existe
      const userToFollow = await prisma.user.findUnique({
        where: { id: followingId }
      });

      if (!userToFollow) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      // Verificar se já está seguindo
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId
          }
        }
      });

      if (existingFollow) {
        res.status(409).json({ error: 'Você já está seguindo este usuário' });
        return;
      }

      // Criar o relacionamento de seguir
      await prisma.follow.create({
        data: {
          followerId,
          followingId
        }
      });

      res.status(201).json({ message: 'Usuário seguido com sucesso' });
    } catch (error) {
      console.error('Erro ao seguir usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Deixar de seguir um usuário
  static async unfollowUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id: followingId } = req.params;
      const followerId = req.userId!;

      // Verificar se o relacionamento existe
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId
          }
        }
      });

      if (!existingFollow) {
        res.status(404).json({ error: 'Você não está seguindo este usuário' });
        return;
      }

      // Remover o relacionamento
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId
          }
        }
      });

      res.json({ message: 'Você deixou de seguir este usuário' });
    } catch (error) {
      console.error('Erro ao deixar de seguir usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
