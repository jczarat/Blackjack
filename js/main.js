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
let faceDown;

/*----- cached element references -----*/

const computerSection = document.querySelector('#computercards');
const playerSection = document.querySelector('#playercards');
const dealButton = document.querySelector('#deal');
const playAgainButton = document.querySelector('#playagain');
const hitButton = document.querySelector('#hit');
const standButton = document.querySelector('#stand');
const computerScoreElement = document.querySelector('#computerscore');
const playerScoreElement = document.querySelector('#playerscore');
const messageElement = document.querySelector('#message');
const computerTitle = document.querySelector('#computertitle');
const playerTitle = document.querySelector('#playertitle');

/*----- event listeners -----*/

playAgainButton.addEventListener('click', init);
dealButton.addEventListener('click', deal);
hitButton.addEventListener('click', hit);
standButton.addEventListener('click', stand);

/*----- functions -----*/
/*----- Initialization -----*/

init();

function init() {
    masterDeck = buildMasterDeck();
    shuffledDeck = buildShuffledDeck();
    computerHand = [];
    playerHand = [];
    computerScore = 0;
    playerScore = 0;
    winner = null;
    renderInit();
}

function buildMasterDeck() {
    const deck = [];
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          face: `${suit}${rank}`,
          value: Number(rank) || (rank === 'A' ? 11 : 10)
        });
      });
    });
    return deck;
}

function buildShuffledDeck() {
    shuffledDeck = [];
    masterDeck.forEach(function(card) {
        const rndIdx = Math.floor(Math.random() * masterDeck.length);
        shuffledDeck.push(masterDeck[rndIdx]);
    });
    return shuffledDeck;
}

/*----- User Actions ----*/

function deal() {
    dealCards(computerHand);
    dealCards(playerHand);
    computerScore = findScore(computerHand, computerScore);
    playerScore = findScore(playerHand, playerScore);
    if (playerScore === 22) pocketAce(playerHand, playerScore);
    if (computerScore === 22) pocketAce(computerHand, computerScore);
    renderDeal();
    checkForBlackjack();
}

function hit() {
    const poppedCard = shuffledDeck.pop();
    playerHand.push(poppedCard);
    playerScore += poppedCard.value;
    renderHit();
    checkForPlayerBust();
}

function stand() {
    while (computerScore < 17) {
        computerHand.push(shuffledDeck.pop());
        computerScore = findScore(computerHand, computerScore);
        }
    if (computerScore > 21) {
        computerScore = checkForAce(computerHand, computerScore, computerScoreElement);
        if (computerScore < 21) {
            stand();
        }
    }
    renderStand();
    determineWinner();
}

/*----- User Helper Functions -----*/

function dealCards(hand) {
    for (i = 0; i < 2; i++) hand.push(shuffledDeck.pop());
}

function findScore(hand, score) {
    score = hand.reduce(function(acc, card) {
        return acc+= card.value;
    }, 0);
    return score;
}

function pocketAce(hand, score) {
    hand[0].value = 1;
    score = findScore(hand, score);
    return score;
}

function checkForAce(hand, score, element) {
    hand.forEach(function(card) {
        if (card.value === 11) {
            card.value = 1;
            score = findScore(hand, score);
            element.textContent = score; 
        }
    });
    return score;
}

/*----- Render Functions -----*/

function renderInit() {
    computerSection.innerHTML = '';
    playerSection.innerHTML = '';
    computerScoreElement.textContent = '';
    playerScoreElement.textContent = '';
    messageElement.textContent = `Click "DEAL" to play.`;
    visibility('visible', 'hidden', 'hidden');
}

function renderDeal() {
    faceDown = document.createElement('div');
    const faceUp = document.createElement('div');
    renderCard(faceDown, 'card back-red large', computerSection);
    renderCard(faceUp, `card ${computerHand[1].face} large`, computerSection);
    playerHand.forEach(function(card) {
        const playerDeal = document.createElement('div');
        renderCard(playerDeal, `card ${card.face} large`, playerSection);
    });
    computerScoreElement.textContent = computerHand[1].value;
    playerScoreElement.textContent = playerScore;
    messageElement.textContent = `Hit or Stand?`;
    visibility('hidden', 'visible', 'hidden');
}

function renderHit() {
    const newHit= document.createElement('div');
    renderCard(newHit, `card ${playerHand[playerHand.length - 1].face} large`, playerSection);
    playerScoreElement.textContent = playerScore;
}

function renderStand() {
    for (let i = 2; i < computerHand.length; i++) {
        const newStand = document.createElement('div');
        renderCard(newStand, `card ${computerHand[i].face} large`, computerSection);
        computerScoreElement.textContent = computerScore;
    }
}

function renderMessage() {
    if (winner === 'player') {
        messageElement.textContent = `The Player Wins!`;
    } else if (winner === 'computer') {
        messageElement.textContent = `The Dealer Wins!`;
    } else {
        messageElement.textContent = `It's a push!`;
    }
}

/*----- Helper Render Functions -----*/

function visibility(deal, gameplay, playagain) {
    dealButton.style.visibility = deal;
    hitButton.style.visibility = gameplay;
    standButton.style.visibility = gameplay;
    computerTitle.style.visibility = gameplay;
    playerTitle.style.visibility = gameplay;
    playAgainButton.style.visibility = playagain;
}

function renderCard(divName, divClass, divParent) {
    divName.setAttribute('class', divClass);
    divParent.appendChild(divName);
}

/*----- Win Logic -----*/

function checkForBlackjack() {
    if (playerScore === 21) winner = 'player';
    endHand();
}

function checkForPlayerBust() {
    if (playerScore > 21) {
        playerScore = checkForAce(playerHand, playerScore, playerScoreElement);
        if (playerScore > 21) {
            winner = 'computer';
        } 
    }
    endHand();
}

function determineWinner() {
    if (computerScore > 21){
        winner = 'player';
    } else if (playerScore === computerScore) {
        winner = 'tie';
    } else if (playerScore > computerScore) {
        winner = 'player';
    } else {
        winner = 'computer';
    }
    endHand();
}

function endHand() {
    if (winner) {
        visibility('hidden', 'hidden', 'visible');
        faceDown.setAttribute('class', `card ${computerHand[0].face} large`);
        computerScoreElement.textContent = computerScore;
        renderMessage();
    }
}