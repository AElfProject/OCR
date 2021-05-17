// SPDX-License-Identifier: MIT
pragma solidity ^0.7.1;

interface AggregatorInterface {
    function latestAnswer()
        external
        view
        returns (
            bytes32,
            uint8,
            bytes32,
            bytes32,
            bytes32[] memory
        );

    function latestTimestamp() external view returns (uint256);

    function latestRound() external view returns (uint256);

    function getAnswer(uint256 roundId)
        external
        view
        returns (
            bytes32,
            uint8,
            bytes32,
            bytes32,
            bytes32[] memory
        );

    function getTimestamp(uint256 roundId) external view returns (uint256);

    event AnswerUpdated(
        bytes32 indexed current,
        uint256 indexed roundId,
        uint256 updatedAt
    );
    event NewRound(
        uint256 indexed roundId,
        address indexed startedBy,
        uint256 startedAt
    );

    function decimals() external view returns (uint8);

    function description() external view returns (string memory);

    function version() external view returns (uint256);

    // getRoundData and latestRoundData should both raise "No data present"
    // if they do not have data to report, instead of returning unset values
    // which could be misinterpreted as actual reported values.
    function getRoundData(uint80 _roundId)
        external
        view
        returns (
            uint80 roundId,
            bytes32 answer,
            uint8 validBytes,
            bytes32 multipleObservationsIndex,
            bytes32 multipleObservationsValidBytes,
            bytes32[] memory multipleObservations,
            uint256 updatedAt
        );

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            bytes32 answer,
            uint8 validBytes,
            bytes32 multipleObservationsIndex,
            bytes32 multipleObservationsValidBytes,
            bytes32[] memory multipleObservations,
            uint256 updatedAt
        );

    function getStringAnswerByIndex(uint256 _roundId, uint8 _index)
        external
        view
        returns (string memory);

    function getStringAnswer(uint256 _roundId)
        external
        view
        returns (uint8[] memory _index, string memory _answerSet);

    function getLatestStringAnswerByIndex(uint8 _index)
        external
        view
        returns (string memory);

    function getLatestStringAnswer()
        external
        view
        returns (uint8[] memory _index, string memory _answerSet);
}
