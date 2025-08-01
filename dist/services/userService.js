"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../utils/prisma");
class UserService {
    static async getUserById(id) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true,
                tweets: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
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
                                username: true
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
                                username: true
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
            return null;
        }
        return {
            ...user,
            followers: user.followers.map((f) => f.follower),
            following: user.following.map((f) => f.following)
        };
    }
    static async followUser(followerId, followingId) {
        // Verificar se não está tentando seguir a si mesmo
        if (followerId === followingId) {
            throw new Error('Você não pode seguir a si mesmo');
        }
        // Verificar se o usuário a ser seguido existe
        const userToFollow = await prisma_1.prisma.user.findUnique({
            where: { id: followingId }
        });
        if (!userToFollow) {
            throw new Error('Usuário não encontrado');
        }
        // Verificar se já está seguindo
        const existingFollow = await prisma_1.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });
        if (existingFollow) {
            throw new Error('Você já está seguindo este usuário');
        }
        // Criar o relacionamento de seguir
        await prisma_1.prisma.follow.create({
            data: {
                followerId,
                followingId
            }
        });
    }
    static async unfollowUser(followerId, followingId) {
        // Verificar se o relacionamento existe
        const existingFollow = await prisma_1.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });
        if (!existingFollow) {
            throw new Error('Você não está seguindo este usuário');
        }
        // Remover o relacionamento
        await prisma_1.prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });
    }
}
exports.UserService = UserService;
