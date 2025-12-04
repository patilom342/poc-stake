# DedlyFi Frontend

Next.js 14 application with TypeScript, Wagmi, and RainbowKit for Web3 wallet integration.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Variables + Tailwind-like utilities
- **Web3**: Wagmi v2 + RainbowKit
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **Notifications**: Sonner (toast)
- **Icons**: Lucide React

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Create a `.env.local` file:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Sepolia Testnet Contracts
NEXT_PUBLIC_SEPOLIA_STAKING_ROUTER=0xd965b8FA53a1b33B19079b9e998F4A928354B826
NEXT_PUBLIC_SEPOLIA_WETH=0x0fe44892c3279c09654f3590cf6CedAc3FC3ccdc
NEXT_PUBLIC_SEPOLIA_WBTC=0x8762c93f84dcB6f9782602D842a587409b7Cf6cd
NEXT_PUBLIC_SEPOLIA_USDC=0xd28824F4515fA0FeDD052eA70369EA6175a4e18b

# WalletConnect (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 🚀 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx        # Home (staking options)
│   ├── positions/      # User positions page
│   └── layout.tsx      # Root layout
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── StakingCard.tsx # Staking option card
│   ├── StakingModal.tsx
│   └── UnstakingModal.tsx
├── hooks/              # Custom React hooks
│   ├── useStake.ts
│   ├── useUnstake.ts
│   ├── useStakingOptions.ts
│   └── useUserAuth.ts
└── utils/              # Utility functions
    └── logger.ts       # Console logging utility
```

## 🎨 Styling

The app uses CSS variables for theming (see `globals.css`):

```css
--color-bg-main: #0a0e27
--color-primary: #3b82f6
--color-text-main: #f1f5f9
```

## 🔗 Key Features

### Wallet Connection
- RainbowKit integration for easy wallet connection
- Support for MetaMask, WalletConnect, Coinbase Wallet, etc.
- Automatic user registration on wallet connect

### Staking Flow
1. User selects a protocol and token
2. Enters amount to stake
3. Approves token spend (ERC20)
4. Confirms staking transaction
5. Transaction is tracked in backend

### Unstaking Flow
1. User opens "Manage Position" modal
2. Views position metrics (earnings, APY, time staked)
3. Enters amount to withdraw
4. Confirms unstaking transaction
5. Tokens are returned to wallet

## 🧪 Testing

```bash
npm test
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_SEPOLIA_STAKING_ROUTER` | StakingRouter contract address | Yes |
| `NEXT_PUBLIC_SEPOLIA_WETH` | WETH token address | Yes |
| `NEXT_PUBLIC_SEPOLIA_WBTC` | WBTC token address | Yes |
| `NEXT_PUBLIC_SEPOLIA_USDC` | USDC token address | Yes |

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

Make sure to add all environment variables in Vercel dashboard.

### Docker

```bash
docker build -t dedlyfi-frontend .
docker run -p 3000:3000 dedlyfi-frontend
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com)
