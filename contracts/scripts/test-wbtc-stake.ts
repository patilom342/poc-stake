import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Testing WBTC staking with account:", deployer.address);

  // Addresses
  const STAKING_ROUTER = "0xe7489b54feF646bf318F043AB7E8A6a1cb456116";
  const WBTC = "0xbAd8c8C58f2c7CEFDD7760DC996CbC71640A32e6";
  const UNISWAP_ADAPTER = "0x5e01a1cBdfddA63D20d74E121B778d87A5AC0178";

  // ABIs
  const ERC20_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];

  const ROUTER_ABI = [
    "function stake(address token, uint256 amount, address adapter) external payable",
    "function supportedAdapters(address adapter) view returns (bool)"
  ];

  // Contracts
  const wbtc = await ethers.getContractAt(ERC20_ABI, WBTC, deployer);
  const router = await ethers.getContractAt(ROUTER_ABI, STAKING_ROUTER, deployer);

  // Check decimals
  const decimals = await wbtc.decimals();
  console.log("WBTC Decimals:", decimals);

  // Check balance
  const balance = await wbtc.balanceOf(deployer.address);
  console.log("WBTC Balance:", ethers.formatUnits(balance, decimals));

  if (balance == BigInt(0)) {
    console.error("No WBTC balance!");
    return;
  }

  // Amount to stake (0.01 WBTC)
  const amount = ethers.parseUnits("0.01", decimals);
  console.log("Staking amount:", amount.toString());

  // 1. Approve
  console.log("Approving router...");
  const approveTx = await wbtc.approve(STAKING_ROUTER, amount);
  await approveTx.wait();
  console.log("Approved!");

  // Check allowance
  const allowance = await wbtc.allowance(deployer.address, STAKING_ROUTER);
  console.log("Allowance:", ethers.formatUnits(allowance, decimals));

  // 2. Stake
  console.log("Staking...");
  try {
    const stakeTx = await router.stake(WBTC, amount, UNISWAP_ADAPTER, { gasLimit: 500000 });
    console.log("Stake tx sent:", stakeTx.hash);
    await stakeTx.wait();
    console.log("✅ WBTC Stake successful!");
  } catch (error: any) {
    console.error("❌ WBTC Stake failed:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
