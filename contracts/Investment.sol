// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISwapContract {
    function swapMNTToUSDC() external payable returns (uint256);
    function swapUSDCToMNT(uint256 usdcIn) external returns (uint256);
    function getQuoteMNTToUSDC(uint256 mntIn) external view returns (uint256);
    function getQuoteUSDCToMNT(uint256 usdcIn) external view returns (uint256);
}

contract MantleInvestmentContract {
    address public owner;
    ISwapContract public swapper;
    address public usdc;

    mapping(address => uint256) public userShares;
    uint256 public totalShares;

    uint256 public constant WITHDRAW_FEE = 100; // 1%
    uint256 public constant FEE_DENOMINATOR = 10000;

    event Rebalanced(string action, uint256 amount);

    constructor(address _swapper, address _usdc) {
        owner = msg.sender;
        swapper = ISwapContract(_swapper);
        usdc = _usdc;
    }

    receive() external payable {
        deposit();
    }

    function deposit() public payable {
        require(msg.value > 0, "Send MNT");
        userShares[msg.sender] += msg.value;
        totalShares += msg.value;
    }

    /// @notice Only owner can rebalance
    /// @param mode 0 = do nothing, 1 = MNT -> USDC, 2 = USDC -> MNT
    function rebalance(uint8 mode) external {
        require(msg.sender == owner, "Not owner");

        if (mode == 2) {
            uint256 mntBalance = address(this).balance;
            require(mntBalance > 1e18, "Not enough MNT");
            uint256 toSwap = mntBalance - 1e18;
            swapper.swapMNTToUSDC{value: toSwap}();
            emit Rebalanced("SELL", toSwap); // sold MNT to get USDC
        } else if (mode == 1) {
            uint256 usdcBalance = IERC20(usdc).balanceOf(address(this));
            IERC20(usdc).approve(address(swapper), usdcBalance);
            swapper.swapUSDCToMNT(usdcBalance);
            emit Rebalanced("BUY", usdcBalance); // used USDC to buy MNT
        } else {
            emit Rebalanced("HOLD", 0);
        }
    }

    function withdraw() external {
        uint256 share = userShares[msg.sender];
        require(share > 0, "Nothing to withdraw");

        uint256 mntBalance = address(this).balance;
        uint256 usdcBalance = IERC20(usdc).balanceOf(address(this));
        uint256 poolValue = mntBalance + usdcBalance;

        uint256 userValue = (share * poolValue) / totalShares;
        uint256 fee = (userValue * WITHDRAW_FEE) / FEE_DENOMINATOR;
        uint256 payout = userValue - fee;

        // update state before transfers
        totalShares -= share;
        userShares[msg.sender] = 0;

        if (mntBalance >= payout) {
            (bool sent, ) = msg.sender.call{value: payout}("");
            require(sent, "MNT payout failed");
        } else {
            uint256 mntShortfall = payout - mntBalance;
            uint256 usdcNeeded = swapper.getQuoteMNTToUSDC(mntShortfall);
            require(usdcBalance >= usdcNeeded, "Not enough USDC");

            if (mntBalance > 0) {
                (bool sentMnt, ) = msg.sender.call{value: mntBalance}("");
                require(sentMnt, "Partial MNT payout failed");
            }

            require(IERC20(usdc).transfer(msg.sender, usdcNeeded), "USDC payout failed");
        }
    }

    /// @notice View function for user + pool investment details
    function getUserInvestmentInfo(address user) external view returns (
        uint256 userDepositMNT,
        uint256 userCurrentValue,
        uint256 totalPoolValue
    ) {
        uint256 mntBalance = address(this).balance;
        uint256 usdcBalance = IERC20(usdc).balanceOf(address(this));

        uint256 usdcAsMNT = swapper.getQuoteUSDCToMNT(usdcBalance);
        totalPoolValue = mntBalance + usdcAsMNT;

        userDepositMNT = userShares[user];
        if (totalShares == 0) {
            userCurrentValue = 0;
        } else {
            userCurrentValue = (userDepositMNT * totalPoolValue) / totalShares;
        }
    }
}