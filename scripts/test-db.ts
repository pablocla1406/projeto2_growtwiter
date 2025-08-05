import { prisma } from '../src/utils/prisma';

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com banco...');
    
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados!');
    
    // Testar uma query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query de teste executada:', result);
    
    await prisma.$disconnect();
    console.log('✅ Desconectado do banco');
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error);
    process.exit(1);
  }
}

testConnection();
