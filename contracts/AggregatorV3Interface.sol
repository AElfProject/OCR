// SPDX-License-Identifier: MIT
pragma solidity ^0.7.1;

interface AggregatorV3Interface {
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
            uint256 startedAt,
            uint256 updatedAt
        );

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            bytes32 answer,
            uint8 validBytes,
            uint256 startedAt,
            uint256 updatedAt
        );
}
