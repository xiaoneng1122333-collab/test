import { Deck } from './deck';
import { Player } from './player';
import { Card, GameState } from './types';

export class BlackjackGame {
  private deck: Deck;
  private player: Player;
  private dealer: Player;
  private gameState: GameState;

  constructor(initialBalance: number = 1000) {
    this.deck = new Deck();
    this.player = new Player('Player', initialBalance);
    this.dealer = new Player('Dealer', Infinity);
    this.gameState = {
      deck: [],
      player: this.player,
      dealer: this.dealer,
      currentBet: 0,
      gameInProgress: false,
      message: ''
    };
  }

  startNewGame(betAmount: number): boolean {
    if (betAmount <= 0 || betAmount > this.player.balance || this.gameState.gameInProgress) {
      return false;
    }

    // Clear hands
    this.player.clearHand();
    this.dealer.clearHand();

    // Check if deck needs reshuffling (less than 20 cards)
    if (this.deck.remainingCards < 20) {
      this.deck.reset();
    }

    // Place bet
    if (!this.player.placeBet(betAmount)) {
      return false;
    }

    this.gameState.currentBet = betAmount;
    this.gameState.gameInProgress = true;
    this.gameState.message = 'Game in progress...';

    // Deal initial cards
    this.player.addCard(this.deck.drawCard()!);
    this.dealer.addCard(this.deck.drawCard()!);
    this.player.addCard(this.deck.drawCard()!);
    this.dealer.addCard(this.deck.drawCard()!);

    // Check for player blackjack
    if (this.player.hasBlackjack) {
      this.endGame('Blackjack! You win!');
    }

    this.updateGameState();
    return true;
  }

  hit(): void {
    if (!this.gameState.gameInProgress) return;

    this.player.addCard(this.deck.drawCard()!);

    if (this.player.isBusted) {
      this.endGame('Bust! You lose!');
    } else if (this.player.score === 21) {
      this.stand();
    }

    this.updateGameState();
  }

  stand(): void {
    if (!this.gameState.gameInProgress) return;

    this.gameState.gameInProgress = false;

    // Dealer's turn
    while (this.dealer.score < 17) {
      this.dealer.addCard(this.deck.drawCard()!);
    }

    this.determineWinner();
    this.updateGameState();
  }

  doubleDown(): boolean {
    if (!this.gameState.gameInProgress || !this.player.canDoubleDown) {
      return false;
    }

    if (this.player.balance < this.gameState.currentBet) {
      return false;
    }

    // Double the bet
    this.player.placeBet(this.gameState.currentBet);
    this.gameState.currentBet *= 2;

    // Draw one more card
    this.player.addCard(this.deck.drawCard()!);

    if (this.player.isBusted) {
      this.endGame('Bust! You lose!');
    } else {
      this.stand();
    }

    this.updateGameState();
    return true;
  }

  private determineWinner(): void {
    const playerScore = this.player.score;
    const dealerScore = this.dealer.score;

    if (this.player.hasBlackjack && !this.dealer.hasBlackjack) {
      this.endGame('Blackjack! You win!');
      this.player.win(this.gameState.currentBet * 2.5); // Blackjack pays 3:2
    } else if (this.dealer.isBusted) {
      this.endGame('Dealer busts! You win!');
      this.player.win(this.gameState.currentBet * 2);
    } else if (playerScore > dealerScore) {
      this.endGame('You win!');
      this.player.win(this.gameState.currentBet * 2);
    } else if (playerScore === dealerScore) {
      this.endGame('Push! It\'s a tie!');
      this.player.win(this.gameState.currentBet); // Return bet
    } else {
      this.endGame('You lose!');
    }
  }

  private endGame(message: string): void {
    this.gameState.gameInProgress = false;
    this.gameState.message = message;
  }

  private updateGameState(): void {
    this.gameState = {
      deck: this.deck['cards'],
      player: this.player,
      dealer: this.dealer,
      currentBet: this.gameState.currentBet,
      gameInProgress: this.gameState.gameInProgress,
      message: this.gameState.message
    };
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  getPlayer(): Player {
    return this.player;
  }

  getDealer(): Player {
    return this.dealer;
  }
}