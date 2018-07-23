const Casino = artifacts.require("./Casino.sol");

contract("Casino", (accounts)=> {

    const owner = accounts[0];
    const casino = await Casino.new({from:owner});
    const casinoAddress = await casino.address;
    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
    const OneEth = 1e+18;


    describe("contract constructor", async ()  => {

        it('has owner', async () => {
            assert.equal(await casino.owner(), owner)
        });


        
        it('minimumBet in ether value is assigned correctly - minimumBet is 10 ether', async () => {
            let _casino = await Casino.new(10, 0, {from: owner});
            assert.equal(await _casino.minimumBet(), 10 );
        });


        it('maxAmountOfBets is assigned correctly' , async () => {
            let _casino = await Casino.new(10, 10, {from: owner});
            assert.equal(await _casino.maxAmountOfBets(), 10 );
        });

   

    
    }); //describe contract constructor



  describe("10 players make bets and transfer 1 ether", async ()  => {

    let numberWinner;
    
    for (i = 0, numberToBet = 1; i < accounts.length; i++, numberToBet++)  {

            it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
                accounts[i]));
        
    }



     async function  playersBet(playerNumberToBet, playerAddress ) {
            
        let casinoBalanceBefore;
        let _numberOfBets = await casino.numberOfBets();

        

          //make sure contract accepted ether
        //compare balanceBefore and balanceAfter before ether acceptance and after, respectively


        it('casino contract accepts bets', async () =>{
          casinoBalanceBefore = web3.eth.getBalance(casinoAddress).toNumber();
          await casino.bet(playerNumberToBet, { value: OneEth, from: playerAddress  })
          const casinoBalanceAfter = web3.eth.getBalance(casinoAddress).toNumber();
          assert.ok(casinoBalanceAfter.greaterThan(casinoBalanceBefore ));
        });



             // Check that the max amount of bets hasn't been met yet
        it('maxAmountOfBets is greater than numberOfBets', async () =>{
          const _maxAmountOfBets  = await casino.maxAmountOfBets();
          const _numberOfBets  = await  casino.numberOfBets();
          assert.isAbove(_maxAmountOfBets,  _numberOfBets,
          'maxAmountOfBets is less than numberOfBets');
        });



          // Check that the player doesn't exists
        it('player does not exists and is able to bet', async () =>{
          let exist = await casino.checkPlayerExists(playerAddress)
          assert.isFalse(exist,  'player exists and is unable to bet one more time');
        });


         //checks that numberToBet meets the range [1,10]
        it('playerNumberToBet meets the range from 1 to 10 ', () =>{
          assert.isTrue(playerNumberToBet>=1 && playerNumberToBet<=10, 
          'playerNumberToBet does not meet the range from 1 to 10');
        });


            // Check that the amount paid is bigger or equal the minimum bet
        // val >= minimumBet
        it('the bet is bigger or equal the minimum bet ', async () =>{
          let _minimumBet  = await casino.minimumBet();
          let _minimumBetBigNumber = web3.toBigNumber(_minimumBet).toNumber();
    
          assert.isAtLeast(OneEth, _minimumBetBigNumber, 'the bet is the less than minimum bet' );
        });


        //Set the number bet for that player
        it('the value of mapping playerBetsNumber[msg.sender] matches numberToBet ', async () =>{
          let _playerNumberToBet = await casino.playerBetsNumber[playerAddress];
          assert.equal(_playerNumberToBet, playerNumberToBet, 
          "the value of mapping playerBetsNumber[msg.sender] does not match numberToBet")
        });



         // check that mapping numberBetPlayers[numberToBet] contains msg.sender 
        // compare length of the array before push and after

        it('The player has bet for that number', async () =>{
          let lengthBeforePush =  await casino.numberBetPlayers[playerNumberToBet].length();
          await casino.numberBetPlayers[playerNumberToBet].then(async function(addressArr) {
          await addressArr.push(playerAddress)}).then(function(lengthAfterPush){
          assert.equal(lengthAfterPush,lengthBeforePush+1,
            'The player failed to bet for a number');
                })
        });


        it('numberOfBets is incremented', async () =>{
        // currentNumberOfBets respresents numberOfbets after incrementation
          const currentNumberOfBets = await casino.numberOfBets();
        // compare incNumberOfBets and _numberOfbets before the increment
          assert.equal(currentNumberOfBets, _numberOfBets+1, 'numberOfBets is not incremented');
        });


        it('prevents totalBet from overflow', async () =>{
        // prevent totalBet from overflow
        await casino.totalBet().then(function (_totalBet) {
        //require(totalBet + msg.value >= totalBet);
         assert.isAtLeast(_totalBet + oneEth, _totalBet, 'totalBet is overflowed' );
        });


        // make sure all players have made a bet 
               
        it('ensures that _numberOfBets  >=  maxAmountOfBets', async () =>{
          let _maxAmountOfBets  = await casino.maxAmountOfBets();
          let _numberOfBets  = await  casino.numberOfBets();
          assert.isAtLeast(_numberOfBets, _maxAmountOfBets, 
          'numberOfBets is less than maxAmountOfBets ');
        });
               
   } //player bet function


  })  //describe 10 players bet

   describe ("generateNumberWinner", async() =>  {

     // Check that the max amount of bets hasn't been met yet
    it('ensures that _numberOfBets  >=  maxAmountOfBets', async () =>{
      let _maxAmountOfBets  = await casino.maxAmountOfBets();
      let _numberOfBets  = await  casino.numberOfBets();
      assert.isAtLeast(_numberOfBets, _maxAmountOfBets, 
      'numberOfBets is less than maxAmountOfBets  ');
    });

     //  Returns a random integer between min (inclusive) and max (inclusive)
     it('produces random numberWinner and ensures it satisfies the range 1-10',
      async ()  => {
      numberWinner = Math.floor(Math.random() * (10 - 1) + 1);
      assert.isTrue(numberWinner>=1 && numberWinner<=10, 
      'numberWinner does not meet the range from 1 to 10');
      });

    }) //describe generate NUmber Winner



    describe ('DistributePrizes', async ()  => {

     let winnerCount, winnerWeiAmount;

       // Check that the max amount of bets hasn't been met yet
      it('ensures that _numberOfBets  >=  maxAmountOfBets', async () =>{
          let _maxAmountOfBets  = await casino.maxAmountOfBets();
          let _numberOfBets  = await  casino.numberOfBets();
          assert.isAtLeast(_numberOfBets, _maxAmountOfBets, 
          ' numberOfBets is less than maxAmountOfBets');
      });


        //to think about to move these variables in before each 
      it('winners exist' , async ()  => {
        winnerCount = await casino.numberBetPlayers[numberWinner].length();
        assert.notEqual(winnerCount, 0, ' no winners exist');
      });

       it('winnerWeiAmount is greater than zero' , async ()  => {
        let  _totalBet = await casino.totalBet();
        winnerWeiAmount  = _totalBet/winnerCount;
        assert.notEqual(winnerWeiAmount, 0, ' winnerWeiAmount is zero');
        });


        describe('Loop through all the winners to send the corresponding prize for each one', 
          async ()  => {

            let contractBalance;

                  //get contract balance make sure it's greater zero
            it('contract balance in not zero' , async ()  => {
             contractBalance = web3.eth.getBalance(casinoAddress).toNumber();
             assert.notEqual(contractBalance, 0 , 'no ether in the contract');
              });


           
           await casino.numberBetPlayers[numberWinner].then(async (winnersAddrArr) =>  {
           winnersAddrArr.forEach( async (winner) => {

                 it('winner gets the prize' , async ()  => {
                 const winnerInitialBalance = web3.eth.getBalance(winner).toNumber();


                  it('transaction hash exists' , async ()  => { web3.eth.sendTransaction( 
                    {from: casinoAddress, to: winner, value: winnerWeiAmount},
                        function(err, transactionHash) {
                          if (!err)
                          tx = transactionHash;
                          assert.isNotNull(tx, "no transaction hash ")
                        }
                  )});

                  const winnerFinalBalance = web3.eth.getBalance(winner).toNumber();

                  assertEqual(winnerFinalBalance , winnerInitialBalance + winnerWeiAmount, 
                                "prize has not deposited to winner's balance" );

                

                  });  // it winnergets the prize

                  
             } // async winner
             ) //for each 
            }  //async winnerAddrArr


            it('delete all the players' , async()  => {

                
                for(i = 1; i <= 10; i++){
                   await casino.numberBetPlayers[i].then( function (playerAddrArray) {
                   assertEqual(playerAddrArray.length, 0, "player exists")
                })}
                     


            });


            it('totalBet 0' , async()  => {
                assertEqual(await casino.totalBet(), 0);



            });


            it('numberofbets 0' , async()  => {
               assertEqual(await casino.numberOfBets(), 0);

             });





      }) //describe Loop through all the winners







































 

})  //casino contract close