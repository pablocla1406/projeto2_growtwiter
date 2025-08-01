"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const prisma_1 = require("./utils/prisma");
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        await prisma_1.prisma.$connect();
        console.log('✅ Conectado ao banco de dados PostgreSQL');
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}
process.on('SIGINT', async () => {
    console.log('\n⏹️  Encerrando servidor...');
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n⏹️  Encerrando servidor...');
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
startServer();
