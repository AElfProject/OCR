// SPDX-License-Identifier: MIT
pragma solidity ^0.7.1;

interface AggregatorInterface {
  function latestAnswer() external view returns (bytes32, uint8, bytes32, bytes32, bytes32[] memory);
  function latestTimestamp() external view returns (uint256);
  function latestRound() external view returns (uint256);
  function getAnswer(uint256 roundId) external view returns (bytes32, uint8, bytes32, bytes32, bytes32[] memory);
  function getTimestamp(uint256 roundId) external view returns (uint256);

  event AnswerUpdated(bytes32 indexed current, uint256 indexed roundId, uint256 updatedAt);
  event NewRound(uint256 indexed roundId, address indexed startedBy, uint256 startedAt);
}
