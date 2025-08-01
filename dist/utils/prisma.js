"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
class PrismaService {
    static getInstance() {
        if (!PrismaService.instance) {
            PrismaService.instance = new client_1.PrismaClient();
        }
        return PrismaService.instance;
    }
    static async disconnect() {
        if (PrismaService.instance) {
            await PrismaService.instance.$disconnect();
        }
    }
}
exports.prisma = PrismaService.getInstance();
