const Voter = artifacts.require('Voter');

module.exports = async function (deployer) {
  deployer.deploy(Voter, ['one', 'two']);
};
