// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title ZeroFeeMNTUSDCPool
 * @dev Basic MNT <-> USDC swapper with no fees, no slippage, no safety checks — for hackathon use only
 */
contract ZeroFeeMNTUSDCPool {
    address public immutable usdc;
    AggregatorV3Interface public immutable mntUsdPriceFeed;

    event SwapMNTToUSDC(address indexed user, uint256 mntIn, uint256 usdcOut);
    event SwapUSDCToMNT(address indexed user, uint256 usdcIn, uint256 mntOut);

    constructor(address _usdc, address _mntUsdFeed) {
        usdc = _usdc;
        mntUsdPriceFeed = AggregatorV3Interface(_mntUsdFeed);
    }

    receive() external payable {}

    function getLatestMNTUSD() public view returns (int256 price) {
        (, price, , , ) = mntUsdPriceFeed.latestRoundData();
        require(price > 0, "Invalid price");
    }

    function getQuoteMNTToUSDC(uint256 mntIn) public view returns (uint256 usdcOut) {
        int256 price = getLatestMNTUSD(); // 1 MNT = price USD (8 decimals)
        uint256 usdValue = uint256(price) * mntIn / 1e18; // to 8 decimals
        usdcOut = usdValue * 1e6 / 1e8; // convert to 6 decimals for USDC
    }

    function getQuoteUSDCToMNT(uint256 usdcIn) public view returns (uint256 mntOut) {
        int256 price = getLatestMNTUSD(); // 1 MNT = price USD (8 decimals)
        uint256 usdValue = usdcIn * 1e8 / 1e6; // convert USDC (6 decimals) to 8 decimals
        mntOut = usdValue * 1e18 / uint256(price); // back to 18 decimals
    }

    function swapMNTToUSDC() external payable returns (uint256 usdcOut) {
        require(msg.value > 0, "Send MNT");
        usdcOut = getQuoteMNTToUSDC(msg.value);
        IERC20(usdc).transfer(msg.sender, usdcOut);
        emit SwapMNTToUSDC(msg.sender, msg.value, usdcOut);
    }

    function swapUSDCToMNT(uint256 usdcIn) external returns (uint256 mntOut) {
        require(usdcIn > 0, "Send USDC");
        IERC20(usdc).transferFrom(msg.sender, address(this), usdcIn);
        mntOut = getQuoteUSDCToMNT(usdcIn);
        payable(msg.sender).transfer(mntOut);
        emit SwapUSDCToMNT(msg.sender, usdcIn, mntOut);
    }
}