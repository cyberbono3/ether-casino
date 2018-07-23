pragma solidity ^0.4.18;


import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";


/*   
     https://consensys.github.io/smart-contract-best-practices/known_attacks/
    Manual checking for known attacks
    reetrancy NO
    cross--function race conditioons
    pitfalls in race conditions NO
    Transaction-Ordering Dependence (TOD) / Front Running  NO
    Integer Overflow and Underflow NO
    DoS with (Unexpected) revert NO
    DoS with Block Gas Limit  NO
    Batch overflow NO
    Parity vulnerability NO














*/




contract Casino is usingOraclize {

   address owner;


   // The minimum bet a user has to make to participate in the game
   uint public minimumBet = 1 ; // 1 ether

   // The total amount of Ether bet for this current game
   uint public totalBet;

   // The total number of bets the users have made
   uint public numberOfBets;

  // The maximum amount of bets can be made for each game
   uint public maxAmountOfBets = 10;


// The max amount of bets that cannot be exceeded to avoid excessive gas consumption
   // when distributing the prizes and restarting the game
   uint public constant LIMIT_AMOUNT_BETS = 100;

   // The number that won the last game
   uint public numberWinner;


   // Array of players
   address[] public players;

   // Each number has an array of players. Associate each number with a bunch of players
   mapping(uint => address[]) numberBetPlayers;

   // The number that each player has bet for
   mapping(address => uint) playerBetsNumber;

   // Modifier to only allow the execution of functions when the bets are completed
   modifier onEndGame(){
      require(numberOfBets >= maxAmountOfBets); _;
   }

   /// @notice Constructor that's used to configure the minimum bet per game and the max amount of bets
   /// @param _minimumBet The minimum bet that each user has to make in order to participate in the game
   /// @param _maxAmountOfBets The max amount of bets that are required for each game
 constructor (uint _minimumBet, uint _maxAmountOfBets)  public {

     
      owner = msg.sender;

     if(_minimumBet > 0) minimumBet = _minimumBet;
     if(_maxAmountOfBets > 0 && _maxAmountOfBets <= LIMIT_AMOUNT_BETS)
      maxAmountOfBets = _maxAmountOfBets;

      // Set the proof of oraclize in order to make secure random number generations
     //  Encountered issue by calling the constructor, commented setProof then works fine
     // 
     oraclize_setProof(proofType_Ledger);
   }

   /// @notice Check if a player exists in the current game
   /// @param player The address of the player to check
   /// @return bool Returns true is it exists or false if it doesn't
   function checkPlayerExists(address player) returns(bool){
      if(playerBetsNumber[player] > 0) return true;
      else 
      return false;
     }

   /// @notice To bet for a number by sending Ether
   /// @param numberToBet The number that the player wants to bet for. Must be between 1 and 10 both inclusive
   function bet(uint numberToBet) payable{

      // Check that the max amount of bets hasn't been met yet
      require(numberOfBets < maxAmountOfBets);

      // Check that the player doesn't exists
      require(checkPlayerExists(msg.sender) == false);

      // Check that the number to bet is within the range
      require(numberToBet >= 1 && numberToBet <= 10);

      // Check that the amount paid is t
      require(msg.value >= minimumBet);      

      // Set the number bet for that player
      playerBetsNumber[msg.sender] = numberToBet;

      // The player msg.sender has bet for that number
      numberBetPlayers[numberToBet].push(msg.sender);

      numberOfBets += 1;
      //prevent totalBet from overflow
      require(totalBet + msg.value >= totalBet);
      totalBet += msg.value;

      if(numberOfBets >= maxAmountOfBets) generateNumberWinner();
   }

   /// @notice Generates a random number between 1 and 10 both inclusive.
   /// Must be payable because oraclize needs gas to generate a random number.
   /// Can only be executed when the game ends.
   function generateNumberWinner() payable  onEndGame {
      uint numberRandomBytes = 7;
      uint delay = 0;
      uint callbackGas = 200000;

      bytes32 queryId = oraclize_newRandomDSQuery(delay, numberRandomBytes, callbackGas);
   }

   /// @notice Callback function that gets called by oraclize when the random number is generated
   /// @param _queryId The query id that was generated to proofVerify
   /// @param _result String that contains the number generated
   /// @param _proof A string with a proof code to verify the authenticity of the number generation
    function __callback( 
     bytes32 _queryId, 
     string _result, 
     bytes _proof
     ) oraclize_randomDS_proofVerify(_queryId, _result, _proof) onEndGame {
       
    

      // Checks that the sender of this callback was in fact oraclize
      assert(msg.sender == oraclize_cbAddress());

      numberWinner = (uint(sha3(_result))%10+1);
      distributePrizes();
   }

   /// @notice Sends the corresponding Ether to each winner then deletes all the
   /// players for the next game and resets the `totalBet` and `numberOfBets`
   function distributePrizes() private onEndGame {
      uint winnerWeiAmount = totalBet / numberBetPlayers[numberWinner].length; // How much each winner gets

      // Loop through all the winners to send the corresponding prize for each one
      //Ensure that we have sufficint amount of gas for transfer otherwise all transactions from for loop will be reverted
      for(uint i = 0; i < numberBetPlayers[numberWinner].length && msg.gas > 200000; i++){
         numberBetPlayers[numberWinner][i].transfer(winnerWeiAmount);
      }

      // Delete all the players for each number
      for(uint j = 1; j <= 10; j++){
         if (numberBetPlayers[j].length > 0)  delete numberBetPlayers[j];
      }
         
      

      totalBet = 0;
      numberOfBets = 0;
   }



}