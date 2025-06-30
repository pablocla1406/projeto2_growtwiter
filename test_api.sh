#!/bin/bash

# Script para testar rapidamente a API Growtwitter
# Certifique-se de que a API está rodando em http://localhost:3000

BASE_URL="http://localhost:3000"
echo "🚀 Iniciando testes da API Growtwitter..."
echo "Base URL: $BASE_URL"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar uma rota
test_route() {
    local method=$1
    local url=$2
    local data=$3
    local headers=$4
    local description=$5
    
    echo -e "${YELLOW}Testando: $description${NC}"
    
    if [ -z "$data" ]; then
        if [ -z "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url")
        else
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url" -H "$headers")
        fi
    else
        if [ -z "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url" \
                -H "Content-Type: application/json" \
                -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url" \
                -H "Content-Type: application/json" \
                -H "$headers" \
                -d "$data")
        fi
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ Sucesso ($http_code)${NC}"
    else
        echo -e "${RED}❌ Falha ($http_code)${NC}"
        echo "Resposta: $body"
    fi
    echo ""
}

# 1. Health Check
test_route "GET" "/health" "" "" "Health Check"

# 2. Registrar usuário de teste
USER_DATA='{
  "name": "Teste Usuario",
  "username": "testusuario",
  "email": "teste@email.com",
  "password": "123456"
}'
test_route "POST" "/auth/register" "$USER_DATA" "" "Registrar usuário"

# 3. Fazer login para obter token
LOGIN_DATA='{
  "email": "teste@email.com",
  "password": "123456"
}'
echo -e "${YELLOW}Fazendo login para obter token...${NC}"
login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")

# Extrair token do JSON (método simples)
TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Falha ao obter token de autenticação${NC}"
    echo "Resposta do login: $login_response"
    exit 1
else
    echo -e "${GREEN}✅ Token obtido com sucesso${NC}"
    echo ""
fi

# 4. Criar tweet
TWEET_DATA='{
  "content": "Tweet de teste da API! 🚀"
}'
test_route "POST" "/tweets" "$TWEET_DATA" "Authorization: Bearer $TOKEN" "Criar tweet"

# 5. Obter feed
test_route "GET" "/tweets/feed" "" "Authorization: Bearer $TOKEN" "Obter feed"

# 6. Obter dados do usuário (usando um ID genérico - pode falhar se não existir)
test_route "GET" "/users/test-user-id" "" "Authorization: Bearer $TOKEN" "Obter dados do usuário (pode falhar se ID não existir)"

echo -e "${GREEN}🎉 Testes básicos concluídos!${NC}"
echo ""
echo "Para testes mais detalhados:"
echo "1. Use o Postman com o arquivo postman_collection.json"
echo "2. Ou siga o guia completo em API_TESTING_GUIDE.md"
echo "3. Para logs detalhados, execute: npm run dev"
