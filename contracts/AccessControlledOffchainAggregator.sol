// SPDX-License-Identifier: MIT
pragma solidity ^0.7.1;

import "./OffchainAggregator.sol";
import "./SimpleReadAccessController.sol";

contract AccessControlledOffchainAggregator is
    OffchainAggregator,
    SimpleReadAccessController
{
    constructor(
        uint32 _maximumGasPrice,
        uint32 _reasonableGasPrice,
        uint32 _microLinkPerEth,
        uint32 _linkGweiPerObservation,
        uint32 _linkGweiPerTransmission,
        address _link,
        AccessControllerInterface _billingAccessController,
        AccessControllerInterface _requesterAccessController,
        uint8 _decimals,
        string memory description
    )
        OffchainAggregator(
            _maximumGasPrice,
            _reasonableGasPrice,
            _microLinkPerEth,
            _linkGweiPerObservation,
            _linkGweiPerTransmission,
            _link,
            _billingAccessController,
            _requesterAccessController,
            _decimals,
            description
        )
    {}

    function latestAnswer()
        public
        view
        override
        checkAccess()
        returns (
            bytes32,
            uint8,
            bytes32,
            bytes32,
            bytes32[] memory
        )
    {
        return super.latestAnswer();
    }

    function latestTimestamp()
        public
        view
        override
        checkAccess()
        returns (uint256)
    {
        return super.latestTimestamp();
    }

    function latestRound()
        public
        view
        override
        checkAccess()
        returns (uint256)
    {
        return super.latestRound();
    }

    function getAnswer(uint256 _roundId)
        public
        view
        override
        checkAccess()
        returns (
            bytes32,
            uint8,
            bytes32,
            bytes32,
            bytes32[] memory
        )
    {
        return super.getAnswer(_roundId);
    }

    function getStringAnswerByIndex(uint256 _roundId, uint8 _index)
        public
        view
        override
        checkAccess()
        returns (
          string memory
        )
    {
        return super.getStringAnswerByIndex(_roundId, _index);
    }

    function getLatestStringAnswerByIndex(uint8 _index)
        public
        view
        override
        checkAccess()
        returns (
          string memory
        )
    {
        return super.getLatestStringAnswerByIndex(_index);
    }

    function getStringAnswer(uint256 _roundId)
        public
        view
        override
        checkAccess()
        returns (uint8[] memory _index, string memory _answerSet)
    {
        return super.getStringAnswer(_roundId);
    }

    function getLatestStringAnswer()
        public
        view
        override
        checkAccess()
        returns (uint8[] memory _index, string memory _answerSet)
    {
        return super.getLatestStringAnswer();
    }

    function getTimestamp(uint256 _roundId)
        public
        view
        override
        checkAccess()
        returns (uint256)
    {
        return super.getTimestamp(_roundId);
    }

    function description()
        public
        view
        override
        checkAccess()
        returns (string memory)
    {
        return super.description();
    }

    function getRoundData(uint80 _roundId)
        public
        view
        override
        checkAccess()
        returns (
            uint80,
            bytes32,
            uint8,
            bytes32,
            bytes32,
            bytes32[] memory,
            uint256
        )
    {
        return super.getRoundData(_roundId);
    }

    function latestRoundData()
        public
        view
        override
        checkAccess()
        returns (
            uint80,
            bytes32,
            uint8,
            bytes32,
            bytes32,
            bytes32[] memory,
            uint256
        )
    {
        return super.latestRoundData();
    }
}
