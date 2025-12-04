# DedlyFi Smart Contracts

Solidity smart contracts for the DedlyFi staking platform, built with Hardhat.

## 🛠️ Tech Stack

- **Framework**: Hardhat
- **Language**: Solidity ^0.8.20
- **Libraries**: OpenZeppelin Contracts
- **Testing**: Hardhat + Chai
- **Network**: Sepolia Testnet (for now)

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Create a `.env` file:

```env
# RPC URLs
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
POLYGON_RPC_URL=https://polygon-rpc.com

# Deployer Private Key
PRIVATE_KEY=your_private_key_here

# Etherscan API (for verification)
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

## 📁 Contract Architecture

```
contracts/
├── core/
│   └── StakingRouter.sol      # Main router contract
├── adapters/
│   └── MockAdapter.sol        # Mock protocol adapter
└── interfaces/
    └── IAdapter.sol           # Adapter interface
```

### StakingRouter.sol
The main contract that:
- Accepts user deposits
- Routes funds to protocol adapters
- Manages fees (0.5% default)
- Emits events for tracking
- Handles unstaking

### IAdapter.sol
Interface that all protocol adapters must implement:
```solidity
interface IAdapter {
    function name() external view returns (string memory);
    function stake(address token, uint256 amount, address onBehalfOf) external payable returns (uint256);
    function unstake(address token, uint256 amount, address to) external returns (uint256);
}
```

### MockAdapter.sol
Simple adapter for testing that:
- Mints 1:1 receipt tokens
- Simulates protocol staking
- Supports unstaking with token burn

## 🚀 Compilation

```bash
npx hardhat compile
```

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/StakingRouter.test.ts
```

## 📤 Deployment

### Sepolia Testnet

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

### Polygon Mainnet

```bash
npx hardhat run scripts/deploy.ts --network polygon
```

### Deployment Output

The script will:
1. Deploy `StakingRouter` contract
2. Deploy 3 `MockAdapter` contracts (Uniswap, Aave, Lido)
3. Whitelist all adapters
4. Print all contract addresses

Save these addresses for frontend/backend configuration.

## ✅ Verification

Verify contracts on Etherscan/Polygonscan:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS "CONSTRUCTOR_ARGS"
```

Example:
```bash
npx hardhat verify --network sepolia 0x123... "0xFeeRecipientAddress"
```

## 📊 Deployed Contracts (Sepolia)

| Contract | Address |
|----------|---------|
| StakingRouter | `0xd965b8FA53a1b33B19079b9e998F4A928354B826` |
| Uniswap Adapter | `0xC53d3B458D3393dA5989285905337E94fd1f9b60` |
| Aave Adapter | `0x6b1A165252ADD50d3a833C628Edd36Eab0325f8e` |
| Lido Adapter | `0xa3a7f23aa87a50b3F02F0d1d6950e07c4bA50DF6` |

## 🔍 Key Functions

### StakingRouter

#### stake()
```solidity
function stake(address token, uint256 amount, address adapter) external
```
Stakes tokens through specified adapter. Charges 0.5% fee.

**Events**: `Staked(user, token, amount, adapter, fee)`

#### unstake()
```solidity
function unstake(address token, uint256 amount, address adapter) external
```
Unstakes tokens from specified adapter.

**Events**: `Unstaked(user, token, amount, adapter)`

#### setAdapter()
```solidity
function setAdapter(address adapter, bool status) external onlyOwner
```
Whitelist/blacklist an adapter.

#### setFee()
```solidity
function setFee(uint256 _feeBasisPoints) external onlyOwner
```
Update fee (max 5%).

## 🔐 Security Considerations

### Current Implementation (PoC)
- Uses `MockAdapters` for testing
- Simplified fee mechanism
- Basic access control

### Production Requirements
- Full security audit
- Real protocol adapters (Aave, Uniswap, Lido)
- Pausable functionality
- Emergency withdrawal
- Reentrancy guards (already using SafeERC20)
- Time locks for admin functions

## 🛣️ Roadmap to Production

1. **Real Adapters**: Implement actual protocol integrations
   - `AaveAdapter.sol` - Interact with Aave V3 Pool
   - `UniswapAdapter.sol` - Manage Uniswap V3 positions
   - `LidoAdapter.sol` - Stake ETH with Lido

2. **Security**: 
   - Professional audit
   - Bug bounty program
   - Multi-sig for admin functions

3. **Gas Optimization**:
   - Optimize storage
   - Batch operations
   - Use assembly where safe

4. **Upgradability** (optional):
   - Consider proxy pattern
   - Or deploy new versions with migration

## 📝 Scripts

- `npx hardhat compile` - Compile contracts
- `npx hardhat test` - Run tests
- `npx hardhat run scripts/deploy.ts --network <network>` - Deploy
- `npx hardhat run scripts/whitelist-adapters.ts --network <network>` - Whitelist adapters
- `npx hardhat run scripts/verify-adapters.ts --network <network>` - Verify whitelist status

## 🐛 Troubleshooting

### Compilation Errors
- Ensure Solidity version is ^0.8.20
- Run `npx hardhat clean` then recompile

### Deployment Fails
- Check you have enough ETH/POL for gas
- Verify RPC URL is correct
- Ensure private key is funded

### Verification Fails
- Wait a few minutes after deployment
- Ensure constructor args match exactly
- Check Etherscan API key is valid

## 📚 Learn More

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Solidity Documentation](https://docs.soliditylang.org)
