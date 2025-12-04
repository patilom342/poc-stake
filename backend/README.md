# DedlyFi Backend

Express.js API server with MongoDB, Redis, and blockchain event listeners.

## 🛠️ Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Queue**: BullMQ + Redis
- **Blockchain**: Viem (Ethereum client)
- **Documentation**: Swagger/OpenAPI
- **Logging**: Custom logger with colors

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Create a `.env` file:

```env
# Server
PORT=3001
ACTIVE_NETWORK=sepolia

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/poc-stake-prod

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Blockchain
RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_for_relayer
STAKING_ROUTER_ADDRESS=0xd965b8FA53a1b33B19079b9e998F4A928354B826

# Token Addresses (Sepolia)
SEPOLIA_USDC_TOKEN=0xd28824F4515fA0FeDD052eA70369EA6175a4e18b
SEPOLIA_WETH_TOKEN=0x0fe44892c3279c09654f3590cf6CedAc3FC3ccdc
SEPOLIA_WBTC_TOKEN=0x8762c93f84dcB6f9782602D842a587409b7Cf6cd

# DEX APIs (optional)
UNISWAP_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3
AAVE_API_URL=https://aave-api-v2.aave.com/data/liquidity/v2
LIDO_API_URL=https://stake.lido.fi/api/short-lido-stats
```

## 🚀 Development

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## 🗄️ Database Setup

### Seed Initial Data

```bash
npm run seed
```

This creates:
- Protocol options (Aave, Uniswap, Lido)
- Token configurations
- APY data

## 📁 Project Structure

```
src/
├── index.ts              # Main server file
├── models/               # Mongoose schemas
│   ├── User.ts
│   ├── ProtocolOption.ts
│   └── StakingTransaction.ts
├── routes/               # API route handlers
│   ├── users.ts
│   ├── stakingOptions.ts
│   ├── transactions.ts
│   └── staking.ts
├── listeners/            # Blockchain event listeners
│   └── contractListener.ts
├── queues/               # BullMQ job queues
│   ├── transactionQueue.ts
│   └── updateOptionsQueue.ts
├── workers/              # Queue workers
│   └── transactionWorker.ts
├── services/             # Business logic
│   └── dexService.ts
├── utils/                # Utilities
│   └── logger.ts
└── config/               # Configuration
    └── swagger.ts
```

## 🔌 API Endpoints

### Users
- `POST /api/users/login` - Register/login user with wallet
- `GET /api/users/:walletAddress` - Get user by address

### Staking Options
- `GET /api/options` - Get available staking options
- `POST /api/options` - Create new option (admin)

### Transactions
- `POST /api/transactions` - Create transaction record
- `GET /api/transactions/:userAddress` - Get user transactions
- `PATCH /api/transactions/:txHash/status` - Update transaction status

### Staking
- `POST /api/stake/execute` - Execute stake (relayer)
- `POST /api/stake/quote` - Get staking quote

### Health
- `GET /health` - Server health check

## 📖 API Documentation

Swagger UI available at: `http://localhost:3001/api-docs`

## 🎯 Event Listeners

The backend listens for blockchain events:

### Staked Event
```solidity
event Staked(address indexed user, address indexed token, uint256 amount, address indexed adapter, uint256 fee)
```

### Unstaked Event
```solidity
event Unstaked(address indexed user, address indexed token, uint256 amount, address indexed adapter)
```

When detected, events are added to the queue and processed by workers.

## 🔄 Queue System

Uses BullMQ for job processing:

- **Transaction Queue**: Processes stake/unstake events
- **Update Options Queue**: Refreshes APY data periodically

View queue dashboard at: `http://localhost:3001/admin/queues`

## 🧪 Testing

```bash
npm test
```

## 📊 Logging

Custom logger with color-coded levels:
- 🔵 INFO
- ✅ SUCCESS
- ⚠️ WARN
- ❌ ERROR

## 🚢 Deployment

### Railway / Render

1. Connect your Git repository
2. Add environment variables
3. Deploy

### Docker

```bash
docker build -t dedlyfi-backend .
docker run -p 3001:3001 dedlyfi-backend
```

## 🔐 Security

- Never commit `.env` files
- Use environment variables for sensitive data
- Implement rate limiting in production
- Use HTTPS in production
- Validate all user inputs

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run seed` - Seed database with initial data
- `npm test` - Run tests

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check `MONGO_URI` is correct
- Ensure IP is whitelisted in MongoDB Atlas

### Redis Connection Issues
- Ensure Redis is running: `redis-cli ping`
- Check `REDIS_URL` configuration

### Event Listener Not Working
- Verify `STAKING_ROUTER_ADDRESS` is correct
- Check RPC URL is responsive
- Ensure contract is deployed on the network
