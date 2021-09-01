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
    uint256 bond;
    // The date the user was added to the database.
    uint32 createdAt;
    // The last time the user redeemed their FIN tokens.
    uint32 lastRedeemedAt;
    // Whether FIN redemption is locked for this account.
    bool locked;
}

/* Contains the base data structures and functions used by other parts of the FixedID contract. */
contract Base is Ownable {
    // The minimum account collateral required. 0.01ETH by default.
    uint256 public minBond = 0.01 ether;

    /* Begin code related to issuing FixedIDs */

    // FixedID->User map. This is the central data structure for storing active users.
    // Keep in sync with `currentOwnerToFixedId`.
    mapping(uint40 => User) fixedIds;
    // Address->FixedID map. Keep in sync with `fixedIds`.
    mapping(address => uint40) currentOwnerToFixedId;

    // The most recently issued FixedID.
    uint40 public lastIssuedId = 0;

    // The number of currently-active FixedIDs. Used to calculate the FIN streaming rate.
    uint40 public activeFixedIds = 0;

    function applyForFixedId(
        string calldata video,
        string calldata photo,
        string calldata name
    ) external payable {
        require(msg.value >= minBond);
        lastIssuedId++;
        fixedIds[lastIssuedId] = User(
            msg.sender,
            video,
            photo,
            name,
            msg.value,
            uint32(block.timestamp),
            uint32(block.timestamp),
            false
        );
        currentOwnerToFixedId[msg.sender] = lastIssuedId;
        activeFixedIds++;
    }

    /* End code related to issuing FixedIDs */

    /* Helper functions */
    function requireOwnFixedId(uint40 fixedId) internal view {
        require(fixedIds[fixedId].wallet == msg.sender, "FID001");
    }
    /* End helper functions */
}
