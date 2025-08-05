"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
class UserController {
    static async getUser(req, res) {
        try {
            const { id } = req.params;
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                res.status(400).json({ error: 'ID de usuário inválido' });
                return;
            }
            const user = await userService_1.UserService.getUserById(userId);
            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado' });
                return;
            }
            res.json({ user });
        }
        catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    static async followUser(req, res) {
        try {
            const { id: followingId } = req.params;
            const followingUserId = parseInt(followingId, 10);
            const followerId = req.userId;
            if (isNaN(followingUserId)) {
                res.status(400).json({ error: 'ID de usuário inválido' });
                return;
            }
            await userService_1.UserService.followUser(followerId, followingUserId);
            res.status(201).json({ message: 'Usuário seguido com sucesso' });
        }
        catch (error) {
            console.error('Erro ao seguir usuário:', error);
            if (error instanceof Error) {
                if (error.message === 'Você não pode seguir a si mesmo') {
                    res.status(400).json({ error: error.message });
                    return;
                }
                if (error.message === 'Usuário não encontrado') {
                    res.status(404).json({ error: error.message });
                    return;
                }
                if (error.message === 'Você já está seguindo este usuário') {
                    res.status(409).json({ error: error.message });
                    return;
                }
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    static async unfollowUser(req, res) {
        try {
            const { id: followingId } = req.params;
            const followingUserId = parseInt(followingId, 10);
            const followerId = req.userId;
            if (isNaN(followingUserId)) {
                res.status(400).json({ error: 'ID de usuário inválido' });
                return;
            }
            await userService_1.UserService.unfollowUser(followerId, followingUserId);
            res.json({ message: 'Você deixou de seguir este usuário' });
        }
        catch (error) {
            console.error('Erro ao deixar de seguir usuário:', error);
            if (error instanceof Error) {
                if (error.message === 'Você não está seguindo este usuário') {
                    res.status(404).json({ error: error.message });
                    return;
                }
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await userService_1.UserService.getAllUsers();
            res.json({ users });
        }
        catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.UserController = UserController;
