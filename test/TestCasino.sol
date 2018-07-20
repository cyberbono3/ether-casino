pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Casino.sol";

contract TestCasino {
    // instance of Casino contract
    Casino casino = Adoption(DeployedAddresses.Casino());

    

    function testMinimumBetWithNewCasinoInstance() public {

        uint expected = 0.01;

        Assert.equal(casino.minimumBet, expected, "Minimum must be 0.01 ether or 10 finney");
    }

    function testMaxAmountOfBetsWithCasinoInstance() public {
    

        uint expected = 10;

        Assert.equal(casino.maxAmountOfBets, expected, "Max amount of bets must be equal 10");
    }


   /*   checkPlayerExists function

   input player address
    if(playerBetsNumber[player] > 0) return true otherwise false


   */



  /*   bet fnction
      
    test if function can accept ether

    etc 


  */


  /*
   generateNumberWinner


  */


   /*
   DistributePrizes


  */










   







    

}
