#!/bin/bash

# DedlyFi Staking PoC - Comandos Útiles

echo "🚀 DedlyFi Staking PoC - Deployment Script"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar menú
show_menu() {
    echo -e "${BLUE}Selecciona una opción:${NC}"
    echo "1. Compilar contratos"
    echo "2. Deploy contratos a Sepolia"
    echo "3. Seed database"
    echo "4. Update adapters en DB"
    echo "5. Iniciar backend (dev)"
    echo "6. Iniciar frontend (dev)"
    echo "7. Iniciar ambos (backend + frontend)"
    echo "8. Build frontend"
    echo "9. Test backend API"
    echo "0. Salir"
    echo ""
}

# Función para compilar contratos
compile_contracts() {
    echo -e "${YELLOW}Compilando contratos...${NC}"
    cd contracts
    npx hardhat compile
    cd ..
    echo -e "${GREEN}✅ Contratos compilados${NC}"
}

# Función para deploy
deploy_contracts() {
    echo -e "${YELLOW}Deploying contratos a Sepolia...${NC}"
    cd contracts
    npx hardhat run scripts/deploy.ts --network sepolia
    cd ..
    echo -e "${GREEN}✅ Contratos deployados${NC}"
    echo -e "${YELLOW}⚠️  No olvides actualizar NEXT_PUBLIC_SEPOLIA_STAKING_ROUTER en frontend/.env.local${NC}"
}

# Función para seed database
seed_database() {
    echo -e "${YELLOW}Seeding database...${NC}"
    cd backend
    npm run seed
    cd ..
    echo -e "${GREEN}✅ Database seeded${NC}"
}

# Función para update adapters
update_adapters() {
    echo -e "${YELLOW}Actualizando adapters en database...${NC}"
    cd backend
    npm run update-adapters
    cd ..
    echo -e "${GREEN}✅ Adapters actualizados${NC}"
}

# Función para iniciar backend
start_backend() {
    echo -e "${YELLOW}Iniciando backend...${NC}"
    cd backend
    npm run dev
}

# Función para iniciar frontend
start_frontend() {
    echo -e "${YELLOW}Iniciando frontend...${NC}"
    cd frontend
    npm run dev
}

# Función para iniciar ambos
start_both() {
    echo -e "${YELLOW}Iniciando backend y frontend...${NC}"
    echo -e "${BLUE}Backend: http://localhost:3001${NC}"
    echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
    
    # Iniciar backend en background
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Esperar un poco
    sleep 3
    
    # Iniciar frontend
    cd frontend
    npm run dev
    
    # Cleanup cuando se cierre
    kill $BACKEND_PID
}

# Función para build frontend
build_frontend() {
    echo -e "${YELLOW}Building frontend...${NC}"
    cd frontend
    npm run build
    cd ..
    echo -e "${GREEN}✅ Frontend built${NC}"
}

# Función para test backend
test_backend() {
    echo -e "${YELLOW}Testing backend API...${NC}"
    echo ""
    echo -e "${BLUE}Health check:${NC}"
    curl -s http://localhost:3001/health | jq .
    echo ""
    echo -e "${BLUE}Staking options (ETH):${NC}"
    curl -s "http://localhost:3001/api/options?token=ETH" | jq .
    echo ""
    echo -e "${GREEN}✅ Tests completados${NC}"
}

# Loop principal
while true; do
    show_menu
    read -p "Opción: " option
    echo ""
    
    case $option in
        1) compile_contracts ;;
        2) deploy_contracts ;;
        3) seed_database ;;
        4) update_adapters ;;
        5) start_backend ;;
        6) start_frontend ;;
        7) start_both ;;
        8) build_frontend ;;
        9) test_backend ;;
        0) 
            echo -e "${GREEN}👋 Hasta luego!${NC}"
            exit 0
            ;;
        *)
            echo -e "${YELLOW}⚠️  Opción inválida${NC}"
            ;;
    esac
    
    echo ""
    read -p "Presiona Enter para continuar..."
    clear
done
