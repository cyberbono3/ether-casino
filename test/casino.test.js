// https://github.com/poanetwork/poa-network-consensus-contracts/blob/master/test/proxy_storage_test.js  poa consensus contracts tests
// https://github.com/ChainSecurity/ctd-token/blob/master/test/CtdToken.phase.mainIco.spec.js
//https://stackoverflow.com/questions/46170937/what-is-the-difference-between-describe-and-it-in-spec-js-file-in-protractor?rq=1  it and describe
// https://jasmine.github.io/2.0/introduction.html   Jasmin 

// https://github.com/mochajs/mocha/issues/911 before and before eacvh running behavior






const Casino = artifacts.require("./Casino.sol");

contract("Casino", (accounts)=> {
 
  

    let casino, casinoAddress, owner;

    //1 Ether in Wei
    const OneEth = 1e+18;

  
   

  


   beforeEach(async () => {
    owner = accounts[0];
    casino = await Casino.new(owner);
    casinoAddress = await casino.address;
    
    
    })
    
   describe("contract constructor", async ()  => {

        it('has owner', async () => {
            assert.equal(await casino.owner(), owner)
        });


        
        it('minimumBet in ether value is assigned correctly - minimumBet is 10 ether', async () => {
            const _casino = await Casino.new(10, 0, {from: owner});
            assert.equal(await _casino.minimumBet(), 10 );
        });


        it('maxAmountOfBets is assigned correctly' , async () => {
            const _casino = await Casino.new(10, 10, {from: owner});
            assert.equal(await _casino.maxAmountOfBets(), 10 );
        });

   

    
    });


    
    describe("10 players make bets and transfer 1 ether", async ()  => {

        // let i = -1;
        // let numberToBet = 0;
        // numberWinner is calculated randomly
        let numberWinner;



        
       
     




        // beforeEach( ()=> {
        //     i++;
        //     numberToBet++;

        // });



        
        // it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
        //     accounts[i]));

        // it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
        //     accounts[i]));
        
        // it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
        //     accounts[i]));

        // it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
        //     accounts[i]));
        
        // it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
        //     accounts[i]));
       
        // it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
        //     accounts[i]));

         
        // it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
        //     accounts[i]));
        
        // it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
        //     accounts[i]));
                
        // it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
        //     accounts[i]));
               
        // it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
        //     accounts[i]));


       // -------------------------------------------------------------



        for (i = 0, numberToBet = 1; i < accounts.length; i++, numberToBet++)  {

            it('player ${i} picks a number ${numberToBet} and transfers 1 Ether', playersBet(numberToBet, 
                accounts[i]));
        
        
        }



         
        


    

         
        async function  playersBet(playerNumberToBet, playerAddress ) {
            
        const casinoBalanceBefore;
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

        //checks that generated number meets the range [1,10]
        /*
        function checkNumberToBetWithinRange()  {
        return numberToBet>=min && numberToBet<=max
        }  */

        //checks that numberToBet meets the range [1,10]
        it('playerNumberToBet meets the range from 1 to 10 ', async () =>{
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
        const lengthBeforePush =  await casino.numberBetPlayers[playerNumberToBet].length();
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
    }



    // make sure all players have made a bet 
               
       it('ensures that _numberOfBets  >=  maxAmountOfBets', async () =>{
                const _maxAmountOfBets  = await casino.maxAmountOfBets();
                const _numberOfBets  = await  casino.numberOfBets();
                assert.isAtLeast(_numberOfBets, _maxAmountOfBets, 
                ' numberOfBets is less than maxAmountOfBets  ');
        });
               



    describe ("generateNumberWinner", () =>  {


                // Check that the max amount of bets hasn't been met yet
                 it('ensures that _numberOfBets  >=  maxAmountOfBets', async () =>{
                const _maxAmountOfBets  = await casino.maxAmountOfBets();
                const _numberOfBets  = await  casino.numberOfBets();
                assert.isAtLeast(_numberOfBets, _maxAmountOfBets, 
                ' numberOfBets is less than maxAmountOfBets  ');
                 });
    




                 
             it('produces random numberWinner and ensures it satisfies the range 1-10', ()  => {
                    //  Returns a random integer between min (inclusive) and max (inclusive)
                    function randBetween(min, max) {
                    return Math.floor(Math.random() * (max - min) + min);
                    }
                    numberWinner = randBetween(1, 10);
                    assert.isTrue(numberWinner>=1 && numberWinner<=10, 
                        'numberWinner does not meet the range from 1 to 10');
                        


                });
 
        


    });



    describe ('DistributePrizes', async ()  => {

                let winnerCount;

                let winnerWeiAmount;

                
            



               // Check that the max amount of bets hasn't been met yet
               it('ensures that _numberOfBets  >=  maxAmountOfBets', async () =>{
                const _maxAmountOfBets  = await casino.maxAmountOfBets();
                const _numberOfBets  = await  casino.numberOfBets();
                assert.isAtLeast(_numberOfBets, _maxAmountOfBets, 
                ' numberOfBets is less than maxAmountOfBets  ');
                 });
    



            //to think about to move these variables in before each 
            it('winners exist' , async ()  => {
                winnerCount = await casino.numberBetPlayers[numberWinner].length();
                assert.notEqual(winnerCount, 0, ' no winners exist');
                });


            
            it('winnerWeiAmount is greater than zero' , async ()  => {
                let  _totalBet = await casino.totalBet();
              
                winnerWeiAmount  = _totalBet/winnerCount;
                assert.notEqual(winnerWeiAmount, 0, ' winnerEtherAmount is zero');
                });


         


            it('Loop through all the winners to send the corresponding prize for each one' , async ()  => {
                //get winners addresses
                  await casino.numberBetPlayers[numberWinner].then( async function (winnersAddrArr)  {
                          winnersAddrArr.forEach( async (winner) => {
                              let contractBalance;
                             
                              // make sure gasLeft is greater 200000

                              //get contract balance make sure it's greater zero
                              it(' contract balance in not zero' , async ()  => {
                              contractBalance = web3.eth.getBalance(casinoAddress).toNumber();
                              assert.notEqual(contractBalance, 0 , 'no ether in the contract');
                              });


                                
                              it('winner gets the prize' , async ()  => {
                              // get winner's balance 
                              const winnerInitialBalance = web3.eth.getBalance(winner).toNumber();
                              await winner.sendTransaction( {from:casinoAddress, value:winnerWeiAmount})  
                              const winnerFinalBalance = web3.eth.getBalance(winner).toNumber();
                              assertEqual(winnerFinalBalance , winnerInitialBalance + winnerWeiAmount, 
                                "prize has not deposited to winner's balance" );
                               });

                            

                              
                      })

                  });

                });




                







            });


        



            

            


            

            

        


            


    
    

  //ensure winnerCount is not zero
  // to add it to solidity code require etc
 

  const _winnerEtherAmount =  _totalBet / winnerCount

  //make sure winnerAmout is greater than zero 

  // to have array of winners

  // to transfer winnerEtherAmountto each winner tand check if gas is included

  //delte all the players for each number

  //generate mroe players in bet

 



  
  const NumberWinner 

  //calculates winner's count
  const _winnersCount = await casino.numberBetPlayers[numberWinner].length();






})



}) //close describe "10 winners make a bet"












/*
    it("testing minimum bet and max amount of
 bets", async () => {
        const casino = await Casino.deployed();


        // convert minimumBet from 10 finney to 0.01 in main casino contract;
        // to ensure it works properly
       
        const _minimumBet =  web3.toWei('10', 'finney');
        const minimumBet = await casino.minimumBet();
        assert.equal(
            minimumBet,
            _minimumBet,
            "minimumBet value is oncorrect"
      );

      const _maxAmountOfBets = 10;
      const maxAmountOfBets = await casino.maxAmountOfBets();
      assert.equal(
        maxAmountOfBets ,
        _maxAmountOfBets,
          "maxAmountOfBets value is not correct"
    );

  */

      








        

    });



  


}