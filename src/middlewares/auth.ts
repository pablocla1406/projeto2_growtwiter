import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';
import { prisma } from '../utils/prisma';

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Token de acesso requerido' });
      return;
    }

    const decoded = AuthUtils.verifyToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      res.status(401).json({ error: 'Usuário não encontrado' });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido' });
  }
};
