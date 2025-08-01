"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const prisma_1 = require("../utils/prisma");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Token de acesso requerido' });
            return;
        }
        const decoded = auth_1.AuthUtils.verifyToken(token);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            res.status(401).json({ error: 'Usuário não encontrado' });
            return;
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(403).json({ error: 'Token inválido' });
    }
};
exports.authenticateToken = authenticateToken;
