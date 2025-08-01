"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_1 = require("../utils/auth");
const prisma_1 = require("../utils/prisma");
class AuthService {
    static async register(userData) {
        const { name, username, email, password } = userData;
        // Verificar se username ou email já existem
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });
        if (existingUser) {
            throw new Error('Username ou email já estão em uso');
        }
        // Hash da senha
        const hashedPassword = await auth_1.AuthUtils.hashPassword(password);
        // Criar usuário
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true
            }
        });
        // Gerar token
        const token = auth_1.AuthUtils.generateToken(user.id);
        return { user, token };
    }
    static async login(loginData) {
        const { login, password } = loginData;
        // Buscar usuário por username ou email
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [
                    { username: login },
                    { email: login }
                ]
            }
        });
        if (!user) {
            throw new Error('Credenciais inválidas');
        }
        // Verificar senha
        const isPasswordValid = await auth_1.AuthUtils.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas');
        }
        // Gerar token
        const token = auth_1.AuthUtils.generateToken(user.id);
        return {
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            },
            token
        };
    }
}
exports.AuthService = AuthService;
