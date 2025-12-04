# DedlyFi Staking Platform

A decentralized staking platform that allows users to stake their crypto assets across multiple DeFi protocols (Aave, Uniswap, Lido) through a unified interface.

## 🏗️ Project Structure

```
poc-stake/
├── frontend/          # Next.js 14 frontend application
├── backend/           # Express.js backend API
├── contracts/         # Solidity smart contracts (Hardhat)
└── .agent/workflows/  # Development workflows
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Redis (for queue management)
- MetaMask or compatible Web3 wallet

### 1. Clone and Install

```bash
# Install all dependencies
cd frontend && npm install
cd ../backend && npm install
cd ../contracts && npm install
```

### 2. Environment Setup

Create `.env` files in each directory (see `.env.example` in each folder).

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SEPOLIA_STAKING_ROUTER=0x...
NEXT_PUBLIC_SEPOLIA_WETH=0x...
NEXT_PUBLIC_SEPOLIA_WBTC=0x...
NEXT_PUBLIC_SEPOLIA_USDC=0x...
```

**Backend** (`backend/.env`):
```env
MONGO_URI=mongodb://...
PORT=3001
REDIS_URL=redis://localhost:6379
STAKING_ROUTER_ADDRESS=0x...
RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key
```

**Contracts** (`contracts/.env`):
```env
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### 3. Deploy Contracts (Sepolia Testnet)

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

Save the deployed contract addresses and update your `.env` files.

### 4. Seed Backend Database

```bash
cd backend
npm run seed
```

### 5. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 📚 Features

- **Multi-Protocol Staking**: Stake across Aave, Uniswap, and Lido
- **Real-time Tracking**: Monitor your positions and earnings
- **Wallet Integration**: Connect with MetaMask via RainbowKit
- **Transaction History**: View all your staking activities
- **Unstaking**: Withdraw your staked assets anytime
- **Event Listeners**: Automatic transaction confirmation via blockchain events

## 🧪 Testing

```bash
# Smart Contracts
cd contracts
npx hardhat test

# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📖 Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Contracts README](./contracts/README.md)
- [Migration to Polygon](./.agent/workflows/migration_to_polygon.md)

## 🔐 Security

- Never commit `.env` files
- Use separate wallets for development and production
- Audit smart contracts before mainnet deployment
- Keep private keys secure

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.
