// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

contract MantleUSDCInvestmentPool {
    using SafeMath for uint256;

    // Token addresses
    address public constant USDC = 0x09Bc4F7D2Bc14Fb48Eb4D3BF4Dc50BdBE0EEF86f; // Mantle USDC
    address public constant MNT = 0x78c1A86Be9Aed6E3248714960B70f4EFD1b59Bb0; // Mantle MNT
    
    // DEX Router (Fusion Finance on Mantle)
    address public constant DEX_ROUTER = 0x1231DEB6e4D9d5A28c699f8E2D20De28Cc1c67A7;

    // Investor details
    struct Investor {
        uint256 totalDeposited;    // Total USDC deposited
        uint256 sharePercentage;   // Percentage share of the pool
        uint256 lastDepositTime;   // Timestamp of last deposit
    }

    // Pool details
    uint256 public totalPoolValue;     // Total value of the pool in USDC
    uint256 public totalInvested;      // Total amount invested
    uint256 public constant FEE_PERCENTAGE = 200; // 2% withdrawal fee
    uint256 public constant PERCENTAGE_DENOMINATOR = 10000;

    // Mappings
    mapping(address => Investor) public investors;
    address[] public investorAddresses;

    // Owner of the contract
    address public owner;

    // Events
    event Deposit(address indexed investor, uint256 amount);
    event Withdrawal(address indexed investor, uint256 amount, uint256 fee);
    event TokenSwap(bool isBuy, uint256 amount);
    event PoolRebalanced(uint256 usdcBalance, uint256 mntBalance);

    constructor() {
        owner = msg.sender;
    }

    // Deposit USDC into the pool
    function deposit(uint256 amount) external {
        require(amount > 0, "Deposit amount must be greater than 0");
        
        // Transfer USDC from user
        IERC20(USDC).transferFrom(msg.sender, address(this), amount);
        
        // Update investor info
        Investor storage investor = investors[msg.sender];
        
        if (investor.totalDeposited == 0) {
            investorAddresses.push(msg.sender);
        }
        
        investor.totalDeposited = investor.totalDeposited.add(amount);
        investor.lastDepositTime = block.timestamp;
        
        // Update pool details
        totalPoolValue = totalPoolValue.add(amount);
        
        // Recalculate share percentages
        _recalculateSharePercentages();
        
        emit Deposit(msg.sender, amount);
    }

    // Internal function to recalculate share percentages
    function _recalculateSharePercentages() internal {
        for (uint i = 0; i < investorAddresses.length; i++) {
            address investorAddress = investorAddresses[i];
            Investor storage investor = investors[investorAddress];
            
            investor.sharePercentage = investor.totalDeposited.mul(PERCENTAGE_DENOMINATOR).div(totalPoolValue);
        }
    }

    // Calculate user's returns
    function calculateReturns(address investor) public view returns (uint256) {
        Investor memory investorInfo = investors[investor];
        
        // If no investment or pool is empty, return 0
        if (investorInfo.totalDeposited == 0 || totalPoolValue == 0) {
            return 0;
        }
        
        // Calculate investor's share of current pool value
        uint256 currentInvestorValue = totalPoolValue.mul(investorInfo.sharePercentage).div(PERCENTAGE_DENOMINATOR);
        
        // Calculate returns (profit or loss)
        if (currentInvestorValue > investorInfo.totalDeposited) {
            return currentInvestorValue.sub(investorInfo.totalDeposited);
        }
        return 0;
    }

    // Withdraw funds
    function withdraw(uint256 amount) external {
        Investor storage investor = investors[msg.sender];
        require(investor.totalDeposited > 0, "No investment found");
        
        // Calculate current investor value
        uint256 currentInvestorValue = totalPoolValue.mul(investor.sharePercentage).div(PERCENTAGE_DENOMINATOR);
        require(amount <= currentInvestorValue, "Withdrawal amount exceeds current value");
        
        // Calculate withdrawal fee
        uint256 fee = amount.mul(FEE_PERCENTAGE).div(PERCENTAGE_DENOMINATOR);
        uint256 amountAfterFee = amount.sub(fee);
        
        // Check USDC balance
        uint256 usdcBalance = IERC20(USDC).balanceOf(address(this));
        
        // If not enough USDC, swap MNT to USDC
        if (usdcBalance < amount) {
            _swapMNTToUSDC(amount.sub(usdcBalance));
        }
        
        // Update investor details
        investor.totalDeposited = investor.totalDeposited.sub(amount);
        
        // Update pool details
        totalPoolValue = totalPoolValue.sub(amount);
        
        // Recalculate share percentages
        _recalculateSharePercentages();
        
        // Transfer funds
        IERC20(USDC).transfer(msg.sender, amountAfterFee);
        
        // If investor has no more deposits, remove from list
        if (investor.totalDeposited == 0) {
            _removeInvestor(msg.sender);
        }
        
        emit Withdrawal(msg.sender, amount, fee);
    }

    // Swap USDC to MNT (only owner)
    function swapUSDCToMNT(uint256 amount) external {
        require(msg.sender == owner, "Only owner can swap");
        require(IERC20(USDC).balanceOf(address(this)) >= amount, "Insufficient USDC balance");
        
        // Approve DEX router to spend USDC
        IERC20(USDC).approve(DEX_ROUTER, amount);
        
        // Prepare swap path
        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = MNT;
        
        // Execute swap
        IUniswapV2Router(DEX_ROUTER).swapExactTokensForTokens(
            amount, 
            0, // Accept any amount of MNT
            path, 
            address(this), 
            block.timestamp + 300 // 5 minutes deadline
        );
        
        emit TokenSwap(true, amount);
    }

    // Swap MNT to USDC (only owner)
    function _swapMNTToUSDC(uint256 amount) internal {
        uint256 mntBalance = IERC20(MNT).balanceOf(address(this));
        require(mntBalance >= amount, "Insufficient MNT balance");
        
        // Approve DEX router to spend MNT
        IERC20(MNT).approve(DEX_ROUTER, amount);
        
        // Prepare swap path
        address[] memory path = new address[](2);
        path[0] = MNT;
        path[1] = USDC;
        
        // Execute swap
        IUniswapV2Router(DEX_ROUTER).swapExactTokensForTokens(
            amount, 
            0, // Accept any amount of USDC
            path, 
            address(this), 
            block.timestamp + 300 // 5 minutes deadline
        );
        
        emit TokenSwap(false, amount);
    }

    // Remove investor from list when they withdraw completely
    function _removeInvestor(address investorToRemove) internal {
        for (uint i = 0; i < investorAddresses.length; i++) {
            if (investorAddresses[i] == investorToRemove) {
                investorAddresses[i] = investorAddresses[investorAddresses.length - 1];
                investorAddresses.pop();
                break;
            }
        }
    }

    // View functions for additional transparency
    function getInvestorDetails(address investor) external view returns (
        uint256 totalDeposited, 
        uint256 sharePercentage, 
        uint256 returns
    ) {
        Investor memory investorInfo = investors[investor];
        return (
            investorInfo.totalDeposited,
            investorInfo.sharePercentage,
            calculateReturns(investor)
        );
    }

    function getTotalPoolValue() external view returns (uint256) {
        return totalPoolValue;
    }

    function getPoolTokenBalances() external view returns (uint256 usdcBalance, uint256 mntBalance) {
        usdcBalance = IERC20(USDC).balanceOf(address(this));
        mntBalance = IERC20(MNT).balanceOf(address(this));
    }

    // Emergency function to withdraw tokens (only owner)
    function emergencyWithdraw(address token) external {
        require(msg.sender == owner, "Only owner");
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(owner, balance);
    }
}