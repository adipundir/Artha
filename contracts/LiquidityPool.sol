// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title AggregatorV3Interface
 * @dev Interface for Chainlink Price Feed
 */
interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

/**
 * @title MantleNativePool
 * @dev A simplified liquidity pool for native MNT and USDC on Mantle Sepolia
 */
contract MantleNativePool {
    // Owner address
    address public owner;
    
    // Hardcoded USDC token address
    address public constant USDC = 0xAcab8129E2cE587fD203FD770ec9ECAFA2C88080;
    
    // Hardcoded Chainlink price feed for MNT/USD
    AggregatorV3Interface public immutable mntUsdPriceFeed = AggregatorV3Interface(0x4c8962833Db7206fd45671e9DC806e4FcC0dCB78);
    
    // Constants
    uint256 public constant PRECISION = 1e18;
    uint256 public constant FEE_PERCENTAGE = 30; // 0.3% fee
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Events
    event SwapMNTToUSDC(address indexed user, uint256 mntIn, uint256 usdcOut);
    event SwapUSDCToMNT(address indexed user, uint256 usdcIn, uint256 mntOut);
    
    // Modifier to restrict access to owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Fallback function to receive MNT
     */
    receive() external payable {}
    
    /**
     * @dev Get the current price of MNT in USD from Chainlink
     * @return price Current price of MNT in USD (scaled by 1e8)
     * @return updatedAt Timestamp of the last price update
     */
    function getMNTUSDPrice() public view returns (int256 price, uint256 updatedAt) {
        (
            ,
            price,
            ,
            updatedAt,
        ) = mntUsdPriceFeed.latestRoundData();
        
        require(price > 0, "MNT/USD price <= 0");
        require(updatedAt > 0, "Price not updated");
        
        // Check if price is stale (older than 1 day)
        require(block.timestamp - updatedAt < 1 days, "MNT/USD price is stale");
    }
    
    /**
     * @dev Get the current exchange rate between MNT and USDC
     * @return mntPerUsdc How much MNT you get for 1 USDC
     * @return usdcPerMnt How much USDC you get for 1 MNT
     */
    function getExchangeRate() external view returns (uint256 mntPerUsdc, uint256 usdcPerMnt) {
        (int256 mntUsdPrice, ) = getMNTUSDPrice();
        
        // Calculate how much MNT you get for 1 USDC
        // 1 USDC = 1 USD, so we need to calculate how much MNT is worth 1 USD
        mntPerUsdc = 1e18 * 1e8 / uint256(mntUsdPrice);
        
        // Calculate how much USDC you get for 1 MNT
        // This is the USD value of 1 MNT converted to USDC (6 decimals)
        usdcPerMnt = uint256(mntUsdPrice) * 1e6 / 1e8;
    }
    
    /**
     * @dev Get price quote for swapping MNT to USDC
     * @param mntAmountIn Amount of MNT to swap
     * @return usdcAmountOut Expected USDC output amount
     */
    function getQuoteMNTToUSDC(uint256 mntAmountIn) public view returns (uint256 usdcAmountOut) {
        // Get MNT/USD price from Chainlink
        (int256 mntUsdPrice, ) = getMNTUSDPrice();
        
        // Calculate the MNT value in USD (with 8 decimals)
        uint256 mntValueInUsd = uint256(mntUsdPrice) * mntAmountIn / 1e18;
        
        // Convert to USDC amount (USDC has 6 decimals)
        usdcAmountOut = mntValueInUsd * 1e6 / 1e8;
        
        // Apply fee
        usdcAmountOut = usdcAmountOut * (FEE_DENOMINATOR - FEE_PERCENTAGE) / FEE_DENOMINATOR;
    }
    
    /**
     * @dev Get price quote for swapping USDC to MNT
     * @param usdcAmountIn Amount of USDC to swap
     * @return mntAmountOut Expected MNT output amount
     */
    function getQuoteUSDCToMNT(uint256 usdcAmountIn) public view returns (uint256 mntAmountOut) {
        // Get MNT/USD price from Chainlink
        (int256 mntUsdPrice, ) = getMNTUSDPrice();
        
        // Calculate the USDC value in USD (with 8 decimals)
        // USDC is considered $1 stable, so 1 USDC = 1 USD (scaled to 1e8)
        uint256 usdcValueInUsd = usdcAmountIn * 1e8 / 1e6;
        
        // Calculate MNT amount (accounting for MNT/USD price and 18 decimals of MNT)
        mntAmountOut = usdcValueInUsd * 1e18 / uint256(mntUsdPrice);
        
        // Apply fee
        mntAmountOut = mntAmountOut * (FEE_DENOMINATOR - FEE_PERCENTAGE) / FEE_DENOMINATOR;
    }
    
    /**
     * @dev Swap MNT to USDC
     * @return usdcAmountOut Amount of USDC received
     */
    function swapMNTToUSDC() external payable returns (uint256 usdcAmountOut) {
        require(msg.value > 0, "Must send MNT");
        
        // Calculate output amount
        usdcAmountOut = getQuoteMNTToUSDC(msg.value);
        
        // Ensure sufficient output liquidity
        uint256 usdcReserve = IERC20(USDC).balanceOf(address(this));
        require(usdcReserve >= usdcAmountOut, "Insufficient USDC liquidity");
        
        // Transfer USDC from pool to user
        require(IERC20(USDC).transfer(msg.sender, usdcAmountOut), "USDC transfer failed");
        
        emit SwapMNTToUSDC(msg.sender, msg.value, usdcAmountOut);
    }
    
    /**
     * @dev Swap USDC to MNT
     * @param usdcAmountIn Amount of USDC to swap
     * @return mntAmountOut Amount of MNT received
     */
    function swapUSDCToMNT(uint256 usdcAmountIn) external returns (uint256 mntAmountOut) {
        require(usdcAmountIn > 0, "Amount must be greater than zero");
        
        // Transfer USDC from user to the pool
        require(IERC20(USDC).transferFrom(msg.sender, address(this), usdcAmountIn), "USDC transfer failed");
        
        // Calculate output amount
        mntAmountOut = getQuoteUSDCToMNT(usdcAmountIn);
        
        // Ensure sufficient MNT liquidity
        require(address(this).balance >= mntAmountOut, "Insufficient MNT liquidity");
        
        // Transfer MNT from pool to user
        (bool success, ) = payable(msg.sender).call{value: mntAmountOut}("");
        require(success, "MNT transfer failed");
        
        emit SwapUSDCToMNT(msg.sender, usdcAmountIn, mntAmountOut);
    }
    
    /**
     * @dev Add liquidity to the pool (MNT)
     */
    function addMNTLiquidity() external payable onlyOwner {
        require(msg.value > 0, "Must send MNT");
    }
    
    /**
     * @dev Add liquidity to the pool (USDC)
     */
    function addUSDCLiquidity(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(IERC20(USDC).transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
    }
}
