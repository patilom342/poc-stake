# 🚀 DedlyFi Staking PoC - Guía de Inicio Rápido

## ✅ Estado del Proyecto

### Completado
- ✅ Smart Contracts compilados (Solidity 0.8.20)
- ✅ Backend con MongoDB integrado
- ✅ Frontend con Next.js 14 y RainbowKit
- ✅ Logger personalizado en backend y frontend
- ✅ Modelos de datos (ProtocolOption, StakingTransaction)
- ✅ API REST completa
- ✅ Seed de base de datos funcionando
- ✅ Build del frontend exitoso

### Pendiente
- ⏳ Deployment de contratos a Sepolia
- ⏳ Actualizar direcciones de contratos en .env
- ⏳ Testing end-to-end

## 📝 Checklist de Deployment

### 1. Preparación
- [ ] Verificar que tienes ETH en Sepolia (usar faucet si es necesario)
- [ ] Verificar que todas las API keys están configuradas
- [ ] Verificar conexión a MongoDB

### 2. Deploy Contratos
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network sepolia
```

Esto generará un archivo en `contracts/deployments/sepolia.json` con todas las direcciones.

### 3. Actualizar .env Files

#### Frontend (.env.local)
```env
NEXT_PUBLIC_SEPOLIA_STAKING_ROUTER=<direccion_del_router>
```

#### Backend - Actualizar opciones en MongoDB
Ejecutar script para actualizar las direcciones de los adapters:
```bash
cd backend
npm run update-adapters
```

### 4. Iniciar Servicios

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## 🔑 Variables de Entorno Actuales

### Contracts
```
PRIVATE_KEY=c259ba4fcc715509dbf7fc3274ab57e3068d8c85219bf1c3081f955ea606f3ec
RPC_URL_SEPOLIA=https://eth-sepolia.g.alchemy.com/v2/1Oj4Vk_7nKKJrTvQRhHpDZEUqWHYxZxz
RPC_URL_POLYGON=https://polygon-mainnet.g.alchemy.com/v2/Fv-R9fLOdROFO60fuqENQ
ETHERSCAN_API_KEY=JUVQ8VUWFIHFFWQ5K5D8IFW5EZ18NU5J91
```

### Backend
```
MONGO_URI=mongodb+srv://devdedlyfi_db_user:ArrzeJpT224RkTSJ@clusterdca.fevf2cq.mongodb.net/poc-stake-prod
PORT=3001
ACTIVE_NETWORK=sepolia
PRIVATE_KEY=c259ba4fcc715509dbf7fc3274ab57e3068d8c85219bf1c3081f955ea606f3ec
RPC_URL_SEPOLIA=https://eth-sepolia.g.alchemy.com/v2/1Oj4Vk_7nKKJrTvQRhHpDZEUqWHYxZxz
```

### Frontend
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WC_PROJECT_ID=ac7fd15874acf324297a079d51249398
NEXT_PUBLIC_RPC_URL_SEPOLIA=https://eth-sepolia.g.alchemy.com/v2/1Oj4Vk_7nKKJrTvQRhHpDZEUqWHYxZxz
NEXT_PUBLIC_SEPOLIA_USDC=0xd28824F4515fA0FeDD052eA70369EA6175a4e18b
NEXT_PUBLIC_SEPOLIA_WETH=0x0fe44892c3279c09654f3590cf6CedAc3FC3ccdc
NEXT_PUBLIC_SEPOLIA_WBTC=0x8762c93f84dcB6f9782602D842a587409b7Cf6cd
NEXT_PUBLIC_SEPOLIA_STAKING_ROUTER=<pendiente_deployment>
```

## 📊 Estructura de Datos en MongoDB

### ProtocolOption
```javascript
{
  id: "uniswap-eth-sepolia",
  protocol: "Uniswap V3",
  token: "ETH",
  apy: 5.2,
  tvl: "$1.2B",
  risk: "Medium",
  adapterAddress: "0x...",
  isActive: true,
  network: "sepolia"
}
```

### StakingTransaction
```javascript
{
  userAddress: "0x...",
  token: "ETH",
  amount: "1000000000000000000", // 1 ETH in wei
  protocol: "Uniswap V3",
  adapterAddress: "0x...",
  txHash: "0x...",
  status: "confirmed",
  fee: "5000000000000000", // 0.005 ETH
  timestamp: ISODate("2025-12-01T..."),
  network: "sepolia"
}
```

## 🧪 Testing

### Test Backend
```bash
cd backend
npm run dev
# En otra terminal:
curl http://localhost:3001/health
curl http://localhost:3001/api/options?token=ETH
```

### Test Frontend
```bash
cd frontend
npm run dev
# Abrir http://localhost:3000
```

## 🔧 Troubleshooting

### Error: Cannot connect to MongoDB
- Verificar que la IP está whitelisted en MongoDB Atlas
- Verificar credenciales en MONGO_URI

### Error: RPC URL not working
- Verificar API key de Alchemy
- Verificar que la red está activa

### Error: Transaction fails
- Verificar que tienes ETH en Sepolia
- Verificar que el contrato está deployado
- Verificar que la dirección del router está actualizada

## 📞 Próximos Pasos

1. **Deploy a Sepolia**: Ejecutar deployment de contratos
2. **Actualizar Addresses**: Copiar direcciones a .env files
3. **Update DB**: Actualizar adapters en MongoDB
4. **Test E2E**: Probar flujo completo de staking
5. **Monitoring**: Configurar logs y monitoring
6. **Security**: Revisar permisos y access control

## 🎯 Comandos Rápidos

```bash
# Compilar contratos
cd contracts && npx hardhat compile

# Seed database
cd backend && npm run seed

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Deploy to Sepolia
cd contracts && npx hardhat run scripts/deploy.ts --network sepolia
```

## 📚 Recursos

- [Hardhat Docs](https://hardhat.org/docs)
- [RainbowKit Docs](https://www.rainbowkit.com/docs/introduction)
- [Wagmi Docs](https://wagmi.sh/)
- [MongoDB Docs](https://www.mongodb.com/docs/)

---

**Nota**: Este es un PoC. Todas las configuraciones están listas para deployment en Sepolia testnet.
