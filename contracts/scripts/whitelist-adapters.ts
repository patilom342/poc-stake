import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log('Whitelisting adapters with account:', deployer.address);
  console.log('Account balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH');

  // Addresses from deployment
  const STAKING_ROUTER_ADDRESS = '0x595424EB3a558d5F888A06746Fd8B5A6584ca976';
  const UNISWAP_ADAPTER = '0xb8152050eCd324186eC1704fD0dF7853380A6aa7';
  const AAVE_ADAPTER = '0xcee40f6aEC2b17E5b3BBB46AAdd3103C0Eb6eA46';
  const LIDO_ADAPTER = '0x8fEB6f4aA42Aec109b5a95A2653297A01Ef1340A';

  const stakingRouter = await ethers.getContractAt('StakingRouter', STAKING_ROUTER_ADDRESS);

  console.log('\n🔐 Whitelisting Adapters...');

  try {
    // Whitelist Uniswap
    console.log('Whitelisting Uniswap adapter...');
    const tx1 = await stakingRouter.setAdapter(UNISWAP_ADAPTER, true, {
      gasLimit: 100000,
    });
    await tx1.wait();
    console.log('✅ Uniswap whitelisted');

    // Wait a bit to avoid nonce issues
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Whitelist Aave
    console.log('Whitelisting Aave adapter...');
    const tx2 = await stakingRouter.setAdapter(AAVE_ADAPTER, true, {
      gasLimit: 100000,
    });
    await tx2.wait();
    console.log('✅ Aave whitelisted');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Whitelist Lido
    console.log('Whitelisting Lido adapter...');
    const tx3 = await stakingRouter.setAdapter(LIDO_ADAPTER, true, {
      gasLimit: 100000,
    });
    await tx3.wait();
    console.log('✅ Lido whitelisted');

    console.log('\n✅ All adapters whitelisted successfully!');

    // Verify
    console.log('\n🔍 Verifying whitelist status...');
    const isUniswapWhitelisted = await stakingRouter.whitelistedAdapters(UNISWAP_ADAPTER);
    const isAaveWhitelisted = await stakingRouter.whitelistedAdapters(AAVE_ADAPTER);
    const isLidoWhitelisted = await stakingRouter.whitelistedAdapters(LIDO_ADAPTER);

    console.log('Uniswap whitelisted:', isUniswapWhitelisted);
    console.log('Aave whitelisted:', isAaveWhitelisted);
    console.log('Lido whitelisted:', isLidoWhitelisted);

  } catch (error: any) {
    console.error('Error whitelisting adapters:', error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
