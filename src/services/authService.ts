import { AuthResponse, LoginData } from "../interfaces/ILogin";
import { CreateUserData } from "../interfaces/IUser";
import { AuthUtils } from "../utils/auth";
import { prisma } from "../utils/prisma";

export class AuthService {
  static async register(userData: CreateUserData): Promise<AuthResponse> {
    const { name, username, email, password } = userData;

    // Verificar se username ou email já existem
    const existingUser = await prisma.user.findFirst({
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
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Criar usuário
    const user = await prisma.user.create({
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
    const token = AuthUtils.generateToken(user.id);

    return { user, token };
  }

  static async login(loginData: LoginData): Promise<AuthResponse> {
    const { login, password } = loginData;

    // Buscar usuário por username ou email
    const user = await prisma.user.findFirst({
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
    const isPasswordValid = await AuthUtils.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token
    const token = AuthUtils.generateToken(user.id);

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
