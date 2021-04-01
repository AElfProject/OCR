const AccessContract = artifacts.require("SimpleWriteAccessController");
const LinkContract = artifacts.require("MockLinkToken");
const OffChainAggregator = artifacts.require("AccessControlledOffchainAggregator");
module.exports = function (deployer) {


    let maximumGasPrice = 1;
    let reasonableGasPrice = 10;
    let microLinkPerEth = 1000000;
    let linkGweiPerObservation = 500;
    let linkGweiPerTransmission = 300;
    let link = LinkContract.address;
    let billingAccessController = AccessContract.address;
    let requesterAccessController = AccessContract.address;
    let decimals = 8;
    let description = "query something";

  deployer.deploy(OffChainAggregator, maximumGasPrice, reasonableGasPrice, microLinkPerEth, linkGweiPerObservation, linkGweiPerTransmission, 
    link, billingAccessController, requesterAccessController, decimals, description);
};
