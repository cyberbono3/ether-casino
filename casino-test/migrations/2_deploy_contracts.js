//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");
var Casino = artifacts.require("./Casino.sol");



module.exports = function(deployer) {
  deployer.deploy(Casino, 10, 10);
};
