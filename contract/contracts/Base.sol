//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct User {
    // The user's current wallet; mutable
    address wallet;
    // The IPFS address of the user's video.
    string video;
    // The IPFS address of the user's photo.
    string photo;
    // The name the user chose when signing up.
    string name;
    // The amount of collateral added to the account, in wei.
    uint256 collateral;
    // The date the user was added to the database.
    uint32 createdAt;
}

/* Contains the base data structures and functions used by other parts of the FixedID contract. */
contract FixedIDBase is Ownable {
    // The minimum account collateral required. 0.01ETH by default.
    uint256 public minCollateral = 0.01 ether;

    // FixedID transfer requests that have been submitted but not yet finalized.
    mapping(uint40 => TransferRequest) transferRequests;

    /* Begin code related to issuing FixedIDs */

    // FixedID to User map. This is the central data structure for storing active users.
    mapping(uint40 => User) fixedIds;

    // The most recently issued FixedID.
    uint40 public lastIssuedId = 0;

    // The number of currently-active FixedIDs. Used to calculate the FIN streaming rate.
    uint40 public activeFixedIds = 0;

    function applyForFixedId(
        string calldata video,
        string calldata photo,
        string calldata name
    ) external payable {
        require(msg.value >= minCollateral);
        lastIssuedId++;
        fixedIds[lastIssuedId] = User(
            msg.sender,
            video,
            photo,
            name,
            msg.value,
            uint32(block.timestamp)
        );
        activeFixedIds++;
    }

    /* End code related to issuing FixedIDs */

    /* Begin code related to managing recovery users */

    struct RecoveryUser {
        // The FixedID of the recovery user.
        uint40 fixedId;
        // The date the recovery user was added.
        uint32 addedAt;
        // The date the recovery user was removed.
        uint32 removedAt;
    }

    mapping(uint40 => RecoveryUser[]) recoveryUsers;

    // Amount of time before a recently-added recovery user can participate in recovery,
    // or a recently-deleted recovery user *can't*.
    uint32 constant recoveryUserWaitTime = 1 weeks;

    function addRecoveryUser(uint40 myFixedId, uint40 recoveryUserFixedId)
        external
    {
        requireOwnFixedId(myFixedId);
        RecoveryUser[] memory myRecoveryUsers = recoveryUsers[myFixedId];

        require(myRecoveryUsers.length <= 16, "FID002");
        for (uint8 i = 0; i < myRecoveryUsers.length; i++) {
            require(
                myRecoveryUsers[i].fixedId != recoveryUserFixedId,
                "FID003"
            );
        }

        recoveryUsers[myFixedId].push(
            RecoveryUser(recoveryUserFixedId, uint32(block.timestamp), 0)
        );
    }

    function reAddRecoveryUser(uint40 myFixedId, uint8 recoveryUserIdx)
        external
    {
        requireOwnFixedId(myFixedId);
        require(
            recoveryUsers[myFixedId][recoveryUserIdx].addedAt > 0,
            "FID004"
        );

        recoveryUsers[myFixedId][recoveryUserIdx].removedAt = 0;
    }

    function removeRecoveryUser(uint40 myFixedId, uint8 recoveryUserIdx)
        external
    {
        requireOwnFixedId(myFixedId);

        recoveryUsers[myFixedId][recoveryUserIdx].removedAt = uint32(
            block.timestamp
        );
    }

    function recoveryUserActive(RecoveryUser memory user)
        private
        view
        returns (bool)
    {
        return
            // Make sure the user was added at least `recoveryUserWaitTime` ago
            (user.addedAt + recoveryUserWaitTime < block.timestamp) &&
            // And that if they're removed, the removal was less than `recoveryUserWaitTime` ago
            (user.removedAt == 0 ||
                (user.removedAt + recoveryUserWaitTime > block.timestamp));
    }

    /* End code related to managing recovery users */

    /* Begin code related to account recovery */

    enum TransferType {
        SELF,
        SOCIAL_RECOVERY,
        ARBITRATION
    }

    // An initiated request to transfer a FixedID to a new wallet
    struct TransferRequest {
        // What initiated the transfer?
        TransferType tType;
        // The new address the FixedID should be transferred to
        address newWallet;
        // When the transfer was submitted
        uint32 submittedAt;
        // The earliest a user can call `completeTransfer` to perform the transfer
        uint32 effectiveAt;
        // When the transfer request expires
        uint32 expiresAt;
    }

    // Let a user transfer their own FixedID to a new wallet.
    function initiateSelfTransfer(uint40 myFixedId, address newWallet)
        external
    {
        requireOwnFixedId(myFixedId);
        clearExpiredTransferRequest(myFixedId);

        // Make sure no higher-priority transfer request is already active
        require(
            transferRequests[myFixedId].tType != TransferType.SOCIAL_RECOVERY &&
                transferRequests[myFixedId].tType != TransferType.ARBITRATION,
            "FID007"
        );
        transferRequests[myFixedId] = TransferRequest(
            TransferType.SELF,
            newWallet,
            uint32(block.timestamp),
            // Wait a week to make sure the transfer isn't challenged
            uint32(block.timestamp + 1 weeks),
            // Give you 4 weeks after the effective date to complete the transfer.
            uint32(block.timestamp + 5 weeks)
        );
    }

    function initiateSocialRecoveryTransfer(uint40 fixedId, address newWallet)
        public
    {
        clearExpiredTransferRequest(fixedId);
        require(
            transferRequests[fixedId].tType != TransferType.SOCIAL_RECOVERY &&
                transferRequests[fixedId].tType != TransferType.ARBITRATION,
            "FID007"
        );
        // TODO: check signatures. See https://github.com/gnosis/safe-contracts/blob/main/contracts/GnosisSafe.sol#L240
        require(false, "initiateSocialRecoveryTransfer not yet implemented");
    }

    function initiateArbitrationTransfer(uint40 fixedId) public {
        require(false, "initiateSocialRecoveryTransfer not yet implemented");
    }

    function completeTransfer(uint40 fixedId) external {
        clearExpiredTransferRequest(fixedId);
        TransferRequest memory request = transferRequests[fixedId];

        // Only let the user who owns a wallet claim a FixedID
        require(msg.sender == request.newWallet, "FID005");
        // Make sure the transfer is already effective
        require(request.effectiveAt < block.timestamp, "FID006");

        fixedIds[fixedId].wallet = request.newWallet;
        delete transferRequests[fixedId];
    }

    function clearExpiredTransferRequest(uint40 fixedId) private {
        if (transferRequests[fixedId].expiresAt == 0) return;
        if (transferRequests[fixedId].expiresAt < block.timestamp)
            delete transferRequests[fixedId];
    }

    /* End code related to account recovery */

    /* Helper functions */
    function requireOwnFixedId(uint40 fixedId) private view {
        require(fixedIds[fixedId].wallet == msg.sender, "FID001");
    }
    /* End helper functions */
}
