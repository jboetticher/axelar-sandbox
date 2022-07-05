// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;
import "./axelar/IAxelarGateway.sol";

// UNTESTED

// Allows users to vote on whether or not to send a token cross chain.
contract VoteToSend {

    struct CrossChainTransferProposal {
        string destinationChain;
        string destinationAddress;
        string token;
        uint256 amount;
    }

    uint256 public voterCount;
    uint128 public proVotes;
    uint128 public nayVotes;
    mapping(address => bool) public isVoter;
    CrossChainTransferProposal public currentProposal;

    IAxelarGateway public gateway;

    constructor(IAxelarGateway _gateway) {
        isVoter[msg.sender] = true;
        voterCount = 1;
        gateway = _gateway;
    }

    modifier onlyVoter() {
        require(isVoter[msg.sender], "Only voters allowed!");
        _;
    }

    function addVoter(address newVoter) external onlyVoter {
        require(!isVoter[msg.sender], "Already a voter!");

        isVoter[newVoter] = true;
    }

    function propose(CrossChainTransferProposal calldata proposal) external onlyVoter {
        require(currentProposal.amount == 0, "Current proposal must be finished!");
        currentProposal = proposal;
    }

    function voteOnProposal(bool vote) onlyVoter external {
        if(vote) proVotes += 1;
        else nayVotes += 1;

        if(proVotes > voterCount / 2) {
            gateway.sendToken(
                currentProposal.destinationChain,
                currentProposal.destinationAddress,
                currentProposal.token,
                currentProposal.amount
            );
            resetProposal();
        }
        else if(nayVotes > voterCount / 2) {
            resetProposal();
        }
    }

    function resetProposal() internal {
        nayVotes = 0;
        proVotes = 0;
        currentProposal = CrossChainTransferProposal("", "", "", 0);
    }

}
