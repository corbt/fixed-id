//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Base.sol";

/* Contains the base data structures and functions used by other parts of the FixedID contract. */
contract Token is Base, IERC20 {
    mapping(address => uint256) private tokenBalances;

    mapping(address => mapping(address => uint256)) private tokenAllowances;

    uint32 private deployedAt;

    // The initial annual issuance is 100M coins/year.
    uint96 private constant initialWeeklyIssuance = 1.9230769 * 10**24;

    // Increase issuance by 2.3% each year. This means that in the
    // long term the total supply will double every 30 years.
    // Have to set the numerator/denominator separately to avoid fractional
    // exponents, which Solidity doesn't support well.
    uint32 private weeklyIssuanceNumerator = 10004442;
    uint32 private weeklyIssuanceDenominator = 10000000;

    constructor() {
        deployedAt = uint32(block.timestamp);
    }

    function name() external pure returns (string memory) {
        return "FixedIncome";
    }

    function symbol() external pure returns (string memory) {
        return "FIN";
    }

    function decimals() external pure returns (uint8) {
        return 18;
    }

    /**
     * @dev The theoretical number of tokens. This is currently a very rough
     * estimate that overestimates the total circulating supply.
     */
    function totalSupply() external view override returns (uint256) {
        return
            ((block.timestamp - deployedAt) * initialWeeklyIssuance) /
            (1 weeks);
    }

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account)
        external
        view
        override
        returns (uint256)
    {
        return
            tokenBalances[account] +
            unredeemedTokens(fixedIds[currentOwnerToFixedId[account]]);
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`. If
     * the user doesn't have enough redeemed tokens, the contract attempts to
     * redeem their unredeemed tokens.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal {
        if (tokenBalances[sender] < amount) claimUnredeemedTokens(sender);

        uint256 senderBalance = tokenBalances[sender];
        require(
            senderBalance >= amount,
            "ERC20: transfer amount exceeds balance"
        );

        unchecked {
            tokenBalances[sender] = senderBalance - amount;
        }
        tokenBalances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender)
        external
        view
        override
        returns (uint256)
    {
        return tokenAllowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        _approve(msg.sender, spender, amount);
        return true;
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        tokenAllowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = tokenAllowances[sender][msg.sender];
        require(
            currentAllowance >= amount,
            "ERC20: transfer amount exceeds allowance"
        );
        unchecked {
            _approve(sender, msg.sender, currentAllowance - amount);
        }

        return true;
    }

    function claimUnredeemedTokens(address wallet) public {
        User storage user = fixedIds[currentOwnerToFixedId[wallet]];
        require(user.createdAt > 0);

        // Locked users can't redeem tokens
        if (user.locked) return;

        uint256 amount = unredeemedTokens(user);

        tokenBalances[wallet] += amount;
        fixedIds[currentOwnerToFixedId[wallet]].lastRedeemedAt = uint32(
            block.timestamp
        );
        emit Transfer(address(0), wallet, amount);
    }

    function unredeemedTokens(User memory user) private view returns (uint256) {
        if (user.lastRedeemedAt == 0) return 0;

        // First, figure out how many weeks the contract has been live for.
        uint16 weeksSinceDeployed = uint16(
            (block.timestamp - deployedAt) / (1 weeks)
        );

        // Raise the weekly issuance inflation rate to the number of weeks since
        // the contract went live to figure out the current issuance rate.
        //
        // Note that I've split the issuance inflation rate into an integer
        // numerator and denominator and done the exponentiation piecewise to
        // avoid fractional exponentiation, wich Solidity doesn't like.
        uint256 currentIssuanceRate = (initialWeeklyIssuance *
            weeklyIssuanceNumerator**weeksSinceDeployed) /
            weeklyIssuanceDenominator**weeksSinceDeployed;

        // Finally, multiply the current issuance rate by the number of weeks
        // since the user last redeemed tokens to see how many tokens should
        // have been issued in that period, and divide *that* by the current
        // number of active FixedIDs to get the actual number of tokens the user
        // is eligible to.
        //
        // Note that this introduces two sources of error in opposite
        // directions. The longer the user waits to redeem their tokens, the
        // higher the `currentIssuanceRate`, so waiting longer between
        // redemptions will get you more tokens. But on the other hand, the
        // longer you wait the more `activeFixedIds` there will be, so the
        // smaller your redemption will be. It's possible to make this
        // calculation more correct but that would be at the expense of higher
        // gas costs, so this approximation seems fine for now. Users (or an
        // agent acting on their behalf) will just need to remember to call
        // `claimUnredeemedTokens` semi-regularly.
        return
            ((currentIssuanceRate * (block.timestamp - user.lastRedeemedAt)) /
                (1 weeks)) / activeFixedIds;
    }
}
