import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export class AuthUtils {
  static generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
  }

  static verifyToken(token: string): { userId: string } {
    const secret = process.env.JWT_SECRET || 'default-secret';
    return jwt.verify(token, secret) as { userId: string };
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
