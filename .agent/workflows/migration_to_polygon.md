---
description: Guía completa para migrar el proyecto de Sepolia (Testnet) a Polygon (Mainnet)
---

# Plan de Migración a Polygon Mainnet

Este documento detalla los pasos necesarios para llevar DedlyFi a la red principal de Polygon.

## 1. Preparación de Smart Contracts

### A. Decisión de Arquitectura
- **Opción 1 (Producción Real - Recomendada)**: Desarrollar `RealAdapters` que interactúen con los protocolos reales en Polygon.
  - `AaveAdapter.sol`: Debe interactuar con el `Pool` de Aave V3 en Polygon.
  - `UniswapAdapter.sol`: Debe interactuar con el `NonfungiblePositionManager` de Uniswap V3 en Polygon.
- **Opción 2 (PoC en Mainnet)**: Usar los `MockAdapters` actuales. Los usuarios depositan fondos reales, pero el rendimiento es simulado/controlado por el admin.

### B. Configuración de Hardhat
1. Actualizar `hardhat.config.ts`:
   ```typescript
   networks: {
     polygon: {
       url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
       accounts: [process.env.PRIVATE_KEY],
       chainId: 137
     }
   }
   ```
2. Obtener `POL` (MATIC) en la wallet de despliegue para el gas.

### C. Direcciones de Tokens en Polygon (Mainnet)
- **USDC (Native)**: `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` (USDC.e es muy común también: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`)
- **WETH**: `0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619`
- **WBTC**: `0x1BFD67037B42Cf73acf2047067bd4F2C47D9BfD6`
- **Aave V3 Pool**: `0x794a61358D6845594F94dc1DB02A252b5b4814aD`

### D. Despliegue
Ejecutar:
```bash
npx hardhat run scripts/deploy.ts --network polygon
```
*Nota: Asegurar que el script de deploy use las direcciones de tokens reales de Polygon, no los Mocks.*

## 2. Configuración del Frontend

### A. Wagmi & RainbowKit
1. Editar `src/config/wagmi.ts` (o donde se configure):
   ```typescript
   import { polygon } from 'wagmi/chains';
   // Añadir polygon a la lista de chains
   ```

### B. Variables de Entorno (.env.local)
Actualizar:
```bash
NEXT_PUBLIC_ACTIVE_NETWORK=polygon
NEXT_PUBLIC_POLYGON_STAKING_ROUTER=0x... (Nueva dirección)
NEXT_PUBLIC_POLYGON_USDC=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
# ... otros tokens
```

### C. Hooks
Asegurar que `useStake.ts` y `useUnstake.ts` seleccionen las direcciones basadas en la red activa (`chain.id`).

## 3. Configuración del Backend

### A. Proveedor RPC
Necesitas un RPC robusto y rápido. La RPC pública de Polygon puede ser lenta.
- Recomendado: Alchemy, Infura, o QuickNode.
- Actualizar `.env`: `RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/TU_API_KEY`

### B. Base de Datos (Seed)
1. Actualizar `src/seed.ts` con las opciones de Polygon:
   - APYs reales (ej: Aave en Polygon suele dar ~3-5% en USDC).
   - Direcciones de los Adapters desplegados en Polygon.
   - IDs de opciones: `aave-usdc-polygon`, etc.
2. Ejecutar `npm run seed`.

### C. Listener
El `contractListener` funcionará igual, siempre que la `RPC_URL` y la `STAKING_ROUTER_ADDRESS` sean las correctas para Polygon.

## 4. Verificación y Pruebas
1. **Verificar Contratos**: `npx hardhat verify ...`
2. **Small Test**: Probar con cantidades pequeñas de dinero real (ej: 1 USDC) antes de lanzar.
