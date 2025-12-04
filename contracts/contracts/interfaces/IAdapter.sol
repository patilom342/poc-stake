// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAdapter {
    /**
     * @notice Stakes funds into the underlying protocol.
     * @param token The token to stake (address(0) for ETH).
     * @param amount The amount to stake.
     * @param onBehalfOf The address that will receive the staked position/receipt tokens.
     * @return amountStaked The actual amount staked.
     */
    function stake(address token, uint256 amount, address onBehalfOf) external payable returns (uint256 amountStaked);
    
    /**
     * @notice Unstakes funds from the underlying protocol.
     * @param token The token to unstake (address(0) for ETH).
     * @param amount The amount to unstake.
     * @param to The address that will receive the unstaked tokens.
     * @return amountUnstaked The actual amount unstaked and returned.
     */
    function unstake(address token, uint256 amount, address to) external returns (uint256 amountUnstaked);
    
    /**
     * @notice Returns the name of the adapter/protocol.
     */
    function name() external view returns (string memory);
}
