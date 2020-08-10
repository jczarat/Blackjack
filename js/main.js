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



/*----- event listeners -----*/




/*----- functions -----*/


init();

function init() {
    masterDeck = buildMasterDeck();
    shuffledDeck = buildShuffledDeck()
    computerHand = [];
    playerHand = [];
    computerScore;
    playerScore;
    winner = null;
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

  console.log(masterDeck);

function buildShuffledDeck() {
    shuffledDeck = [];
    masterDeck.forEach(card => {
        const rndIdx = Math.floor(Math.random() * masterDeck.length);
        shuffledDeck.push(masterDeck[rndIdx]);
    })
    return shuffledDeck;
  }

  console.log(shuffledDeck);