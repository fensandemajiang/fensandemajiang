var Tables = artifacts.require('../contracts/Tables.sol');

module.exports = function (deployer, network) {
  deployer.deploy(Tables);
};
