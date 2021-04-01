const LinkContract = artifacts.require("MockLinkToken");
module.exports = function (deployer) {
  deployer.deploy(LinkContract);
};
