//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Base.sol";

/* Lets users challenge a potentially fraudulent FixedID. Right now, there's no
escalation path and the contract owner can arbitrarily rule on any challenge.
This is of course a temporary expediency and this will later be replaced with a
jury trial on Kleros or similar. */
contract Challenges is Base {
    enum ChallengeStatus {
        SUBMITTED,
        CHALLENGER_WON,
        CHALLENGEE_WON
    }

    struct Challenge {
        // The FixedID of the challenger. Every challenge is associated with an
        // identified FixedID so we can keep an eye on abuse and potentially
        // build a system to revoke challenge privileges if necessary.
        uint40 challenger;
        // The amount of collateral the challenger submitted
        uint256 challengerBond;
        // The status of the challenge
        ChallengeStatus status;
        // Whether the winner of the challenge has collected the bond
        bool bondCollected;
        // A list of IPFS addresses to evidence the challenger has submitted to
        // demonstrate the challengee's FixedID is fraudulent.
        string[] challengerEvidence;
        // A list of IPFS addresses to evidence the challengee has submitted to
        // demonstrate the challengee's FixedID is fraudulent
        string[] challengeeEvidence;
        // The timestamp when the challenge was submitted
        uint32 submittedAt;
    }

    mapping(uint40 => Challenge[]) challenges;

    function submitChallenge(
        uint40 challenger,
        uint40 challengee,
        string[] calldata evidence
    ) external payable {
        // Currently, an initial challenge requires the same bond as an
        // application. The right number here is probably different, but this
        // seems like an ok place to start.
        require(msg.value >= minBond);
        require(fixedIds[challenger].wallet == msg.sender);

        challenges[challengee].push(
            Challenge(
                challenger,
                msg.value,
                ChallengeStatus.SUBMITTED,
                false,
                evidence,
                new string[](0),
                uint32(block.timestamp)
            )
        );
        emit ChallengeSubmitted(challengee, challenger);
    }

    // Lets the challengee submit evidence defending their FixedID from an open
    // challenge.
    function submitChallengeeEvidence(
        uint40 challengee,
        uint256 challengeIndex,
        string[] calldata evidence
    ) external {
        // Once you've submitted evidence, you can't go back and change it.
        require(
            challenges[challengee][challengeIndex].challengeeEvidence.length ==
                0
        );
        challenges[challengee][challengeIndex].challengeeEvidence = evidence;
        emit EvidenceSubmitted(challengee, challengeIndex);
    }

    // Right now, the contract owner can just arbitrarily rule on any outstanding challenge.
    // Decentralizing this is a high priority.
    function ruleOnChallenge(
        uint40 challengee,
        uint256 challengeIndex,
        bool challengerWon
    ) public onlyOwner {
        Challenge memory challenge = challenges[challengee][challengeIndex];
        // Make sure we only pay out each challenge once
        require(challenge.bondCollected == false);

        if (challengerWon) {
            challenges[challengee][challengeIndex].bondCollected = true;
            challenges[challengee][challengeIndex].status = ChallengeStatus
                .CHALLENGER_WON;

            uint256 amountToPay = fixedIds[challengee].bond +
                challenge.challengerBond;
            delete currentOwnerToFixedId[fixedIds[challengee].wallet];
            delete fixedIds[challengee];

            // TODO: what should we do if you won the challenge, but your
            // account no longer exists?
            require(
                fixedIds[challenge.challenger].wallet != address(0),
                "Challenger no longer exists"
            );
            (bool success, ) = fixedIds[challenge.challenger].wallet.call{
                value: amountToPay
            }("");
            require(success);
            emit ChallengeRuled(
                challengee,
                challengeIndex,
                ChallengeStatus.CHALLENGER_WON
            );
        } else {
            challenges[challengee][challengeIndex].bondCollected = true;
            challenges[challengee][challengeIndex].status = ChallengeStatus
                .CHALLENGEE_WON;

            (bool success, ) = fixedIds[challengee].wallet.call{
                value: challenge.challengerBond
            }("");
            require(success);

            emit ChallengeRuled(
                challengee,
                challengeIndex,
                ChallengeStatus.CHALLENGEE_WON
            );
        }
    }

    event ChallengeSubmitted(
        uint40 indexed challengee,
        uint40 indexed challenger
    );
    event EvidenceSubmitted(uint40 indexed challengee, uint256 challengeIndex);
    event ChallengeRuled(
        uint40 indexed challengee,
        uint256 challengeIndex,
        ChallengeStatus status
    );
}
