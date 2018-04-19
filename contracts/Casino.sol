pragma solidity ^0.4.20;
contract Casino {
   address public owner;
   uint256 public minimumBet;
   uint256 public totalBet;
   uint256 public numberOfBets;
   uint256 public maxAmountOfBets = 100;
   address[] public players;
   //we would like to keep track of how much ether a user has bet and for what number
  
  
   struct Player {
      uint256 amountBet;
      uint256 numberSelected;
   }

   // The address of the player and => the user info   
   mapping(address => Player) public playerInfo;

   function Casino(uint256 _minimumBet){
   owner = msg.sender;
   require(_minimumBet != 0 );
   minimumBet = _minimumBet;
}


   function kill() public {
      require(msg.sender == owner);
      selfdestruct(owner);
   }

    function checkPlayerExists(address player) public constant returns(bool){
      for(uint256 i = 0; i < players.length; i++){
         if(players[i] == player) return true;
      }
      return false;
   }


  // To bet for a number between 1 and 10 both inclusive
   function bet(uint256 numberSelected) public payable {
      require(!checkPlayerExists(msg.sender));
      require(numberSelected >= 1 && numberSelected <= 10);
      require(msg.value >= minimumBet);
      playerInfo[msg.sender].amountBet = msg.value;
      playerInfo[msg.sender].numberSelected = numberSelected;
      numberOfBets++;
      players.push(msg.sender);
      totalBet += msg.value;
      if(numberOfBets >= maxAmountOfBets) generateNumberWinner();
   }

    // Generates a number between 1 and 10 that will be the winner
   function generateNumberWinner() public {
     uint256 numberGenerated = uint(block.blockhash(block.number-1))%10 + 1
      distributePrizes(numberGenerated);


   }




    // Sends the corresponding ether to each winner depending on the total bets
   function distributePrizes(uint256 numberWinner) public {
      address[100] memory winners; // We have to create a temporary in memory array with fixed size
      uint256 count = 0; // This is the count for the array of winners
      for(uint256 i = 0; i < players.length; i++){
         address playerAddress = players[i];
         if(playerInfo[playerAddress].numberSelected == numberWinner){
            winners[count] = playerAddress;
            count++;
         }
         delete playerInfo[playerAddress]; // Delete all the players
      }
      players.length = 0; // Delete all the players array
      uint256 winnerEtherAmount = totalBet / winners.length; // How much each winner gets
      for(uint256 j = 0; j < count; j++){
         if(winners[j] != address(0)) // Check that the address in this fixed array is not empty
         winners[j].transfer(winnerEtherAmount);
      }
   }


   // Fallback function in case someone sends ether to the contract so it doesn't get lost and to increase the treasury of this contract that will be distributed in each game
   // This will allow you to save the ether you send to the contract. Otherwise it would be rejected.
   function() public payable {}



}