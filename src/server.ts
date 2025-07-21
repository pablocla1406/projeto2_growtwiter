import app from './app';
import { prisma } from './utils/prisma';

const PORT = process.env.PORT || 3000;

// Função para iniciar o servidor
async function startServer() {
  try {
    // Testar conexão com o banco
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados PostgreSQL');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏹️  Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

// Iniciar servidor
startServer();
