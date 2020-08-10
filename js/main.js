/*----- constants -----*/

const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];


/*----- app's state (variables) -----*/

let masterDeck;
let shuffledDeck;
let computerHand;
let playerHand;
let computerScore;
let playerScore;
let winner;

/*----- cached element references -----*/

const computerSection = document.querySelector('#computercards');
const playerSection = document.querySelector('#playercards');
const dealButton = document.querySelector('#deal');
const playAgainButton = document.querySelector('#playagain');
const hitButton = document.querySelector('#hit');
const standButton = document.querySelector('#stand');
const computerScoreElement = document.querySelector('#computerscore');
const playerScoreElement = document.querySelector('#playerscore');


/*----- event listeners -----*/

playAgainButton.addEventListener('click', init);
dealButton.addEventListener('click', deal);
hitButton.addEventListener('click', hit);
standButton.addEventListener('click', stand);


/*----- functions -----*/
/*----- initialization -----*/
init();

function init() {
    masterDeck = buildMasterDeck();
    shuffledDeck = buildShuffledDeck()
    computerHand = [];
    playerHand = [];
    computerScore;
    playerScore;
    winner = null;
    playAgainButton.style.visibility = 'hidden';
    hitButton.style.visibility = 'hidden';
    standButton.style.visibility = 'hidden';
    renderDeal();
}

function buildMasterDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' property for game of blackjack, not war
          value: Number(rank) || (rank === 'A' ? 11 : 10)
        });
      });
    });
    return deck;
  }

function buildShuffledDeck() {
    shuffledDeck = [];
    masterDeck.forEach(card => {
        const rndIdx = Math.floor(Math.random() * masterDeck.length);
        shuffledDeck.push(masterDeck[rndIdx]);
    })
    return shuffledDeck;
  }







/*----- User Actions ----*/

function deal() {
    for (i = 0; i < 2; i++) {
        let poppedCard = shuffledDeck.pop();
        computerHand.push(poppedCard);
    }
    for (i = 0; i < 2; i++) {
        let poppedCard = shuffledDeck.pop();
        playerHand.push(poppedCard);
    }
    computerScore = computerHand.reduce((acc, card) => {
        return acc+= card.value;
    }, 0);
    playerScore = playerHand.reduce((acc, card) => {
        return acc+= card.value;
    }, 0);
    dealButton.style.visibility = 'hidden';
    hitButton.style.visibility = 'visible';
    standButton.style.visibility = 'visible';
    renderDeal();
  }

function hit() {
    let poppedCard = shuffledDeck.pop();
    playerHand.push(poppedCard);
    playerScore += poppedCard.value;
    renderHit();
    checkForBust();
}

function stand() {
    while (computerScore <= 17) {
        let poppedCard = shuffledDeck.pop();
        computerHand.push(poppedCard);
        computerScore += poppedCard.value;
        console.log(computerHand)
        console.log(computerScore);
    }
    renderStand()
    determineWinner()
}





/*----- Render Functions -----*/

function renderDeal() {
    computerHand.forEach(card => {
        let newDiv = document.createElement('div');
        newDiv.setAttribute('class', `card ${card.face}`);
        computerSection.appendChild(newDiv);
    });
    playerHand.forEach(card => {
        let newDiv = document.createElement('div');
        newDiv.setAttribute('class', `card ${card.face}`);
        playerSection.appendChild(newDiv);
    })
    computerScoreElement.textContent = computerScore;
    playerScoreElement.textContent = playerScore;
}

function renderHit() {
    let newCardIndex = playerHand.length - 1;
    let newDiv = document.createElement('div');
    newDiv.setAttribute('class', `card ${playerHand[newCardIndex].face}`);
    playerSection.appendChild(newDiv);
    playerScoreElement.textContent = playerScore;
}

function renderStand() {
    for (let i = 2; i < computerHand.length; i++) {
        let newDiv = document.createElement('div');
        newDiv.setAttribute('class', `card ${computerHand[i].face}`);
        computerSection.appendChild(newDiv);
        computerScoreElement.textContent = computerScore;
    }
}








/*----- Win Logic -----*/

function checkForBust() {
    if (playerScore > 21) {
        winner = 'computer';
    }
    winner ? playAgainButton.style.visibility = 'visible' : playAgainButton.style.visibility = 'hidden';
    console.log(winner);
}

function determineWinner() {
    if (computerScore > 21){
        winner = 'player'
    } else if (playerScore === computerScore) {
        winner = 'tie';
    } else if (playerScore > computerScore) {
        winner = 'player';
    } else {
        winner = 'computer';
    }
    winner ? playAgainButton.style.visibility = 'visible' : playAgainButton.style.visibility = 'hidden';
    console.log(winner);
}