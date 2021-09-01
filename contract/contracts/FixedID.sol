//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Base.sol";
import "./Token.sol";
import "./IDRecovery.sol";
import "./Challenges.sol";

contract FixedID is IDRecovery, Token, Challenges {}
