#!/bin/bash

# Script para integração com GitHub
# Uso: ./scripts/integrate-with-github.sh

set -e

echo "🚀 Iniciando integração com GitHub..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Este script deve ser executado na raiz do projeto"
    exit 1
fi

# Verificar se o Git está configurado
if ! git config --get user.name > /dev/null 2>&1; then
    error "Git não está configurado. Configure seu nome e email:"
    echo "git config --global user.name 'Seu Nome'"
    echo "git config --global user.email 'seu@email.com'"
    exit 1
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    warn "Há mudanças não commitadas. Deseja continuar? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log "Operação cancelada"
        exit 0
    fi
fi

# URL do repositório GitHub
GITHUB_REPO="https://github.com/TVDoutor/doutor-contrato-facil.git"

log "Verificando acesso ao repositório GitHub..."

# Tentar clonar o repositório para verificar acesso
if git ls-remote "$GITHUB_REPO" > /dev/null 2>&1; then
    log "Acesso ao repositório confirmado"
else
    error "Não foi possível acessar o repositório: $GITHUB_REPO"
    error "Verifique se você tem acesso ao repositório"
    exit 1
fi

# Criar backup do estado atual
log "Criando backup do estado atual..."
git add .
git commit -m "Backup: Estado atual antes da integração" || true

# Verificar se já existe um remote para o GitHub
if git remote get-url origin > /dev/null 2>&1; then
    CURRENT_REMOTE=$(git remote get-url origin)
    if [ "$CURRENT_REMOTE" != "$GITHUB_REPO" ]; then
        warn "Remote atual: $CURRENT_REMOTE"
        warn "Deseja adicionar o GitHub como remote 'github'? (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            git remote add github "$GITHUB_REPO"
            log "GitHub adicionado como remote 'github'"
        fi
    fi
else
    git remote add origin "$GITHUB_REPO"
    log "GitHub configurado como remote 'origin'"
fi

# Verificar se existe a branch main
if ! git branch --list | grep -q "main"; then
    if git branch --list | grep -q "master"; then
        log "Renomeando branch master para main..."
        git branch -M main
    else
        log "Criando branch main..."
        git checkout -b main
    fi
fi

# Fazer push para o GitHub
log "Enviando mudanças para o GitHub..."
if git remote get-url github > /dev/null 2>&1; then
    git push github main
else
    git push origin main
fi

log "✅ Integração concluída com sucesso!"

echo ""
echo "📋 Próximos passos:"
echo "1. Acesse o repositório no GitHub: $GITHUB_REPO"
echo "2. Configure GitHub Pages se necessário"
echo "3. Configure GitHub Actions para deploy automático"
echo "4. Teste as funcionalidades no ambiente de produção"
echo ""
echo "🔐 Credenciais de teste:"
echo "   Admin: admin@tvdoutor.com / admin123"
echo "   Usuário: user@tvdoutor.com / user123"
echo ""
echo "📚 Documentação: docs/github-integration.md"

# Verificar se o build funciona
log "Testando build de produção..."
if npm run build; then
    log "✅ Build de produção bem-sucedido"
else
    error "❌ Erro no build de produção"
    exit 1
fi

log "🎉 Integração finalizada! O sistema está pronto para produção." 