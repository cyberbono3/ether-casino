
//In this file is where you set up the values that the constructor of your contract will receive

/*
First we require the Casino.sol contract.
Then, in the .deploy() method we specify the minimum bet, in this case it’s 0.1 ether converted
 to wei with that function.
100 is the max amount of players.
Finally the gas limit that we are willing to use to deploy the contra
*/

var Casino = artifacts.require("./Casino.sol");
module.exports = function(deployer) {
  deployer.deploy(web3.toWei(0.1, 'ether'), {gas: 3000000});
};