import { BlackjackGame } from './game';
import { Card } from './types';
import { AudioManager } from './audio';

class BlackjackUI {
  private game: BlackjackGame;
  private selectedBet: number = 0;

  constructor() {
    AudioManager.initialize();
    this.game = new BlackjackGame(1000);
    this.setupEventListeners();
    this.updateUI();
  }

  private setupEventListeners(): void {
    // Chip selection
    document.querySelectorAll('.chips').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const value = parseInt((e.target as HTMLElement).dataset.value || '0');
        this.addToBet(value);
        AudioManager.playBetSound();
      });
    });

    // Add click sounds to buttons
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        AudioManager.playClick();
      });
    });
  }

  private addToBet(value: number): void {
    const newBet = this.selectedBet + value;
    if (newBet > this.game.getPlayer().balance) {
      this.showMessage('Insufficient balance!');
      return;
    }
    this.selectedBet = newBet;
    document.getElementById('currentBet')!.textContent = this.selectedBet.toString();
    this.showMessage('');
  }

  private clearBet(): void {
    this.selectedBet = 0;
    document.getElementById('currentBet')!.textContent = '0';
    this.showMessage('');
  }

  private startGame(): void {
    if (this.selectedBet === 0) {
      this.showMessage('Please select a bet amount!');
      return;
    }

    if (this.selectedBet > this.game.getPlayer().balance) {
      this.showMessage('Insufficient balance!');
      return;
    }

    this.game.startNewGame(this.selectedBet);
    AudioManager.playCardSound();
    this.updateUI();
  }

  private hit(): void {
    this.game.hit();
    AudioManager.playCardSound();
    this.updateUI();
  }

  private stand(): void {
    this.game.stand();
    this.updateUI();
  }

  private doubleDown(): void {
    this.game.doubleDown();
    AudioManager.playClick();
    this.updateUI();
  }

  private newGame(): void {
    this.selectedBet = 0;
    document.querySelectorAll('.chips').forEach(chip => {
      chip.classList.remove('selected');
    });

    document.getElementById('betSection')!.style.display = 'block';
    document.getElementById('gameArea')!.style.display = 'none';
    document.getElementById('gameControls')!.style.display = 'none';
    document.getElementById('currentBet')!.textContent = '0';

    this.showMessage('');
  }

  private updateUI(): void {
    const gameState = this.game.getGameState();
    const player = this.game.getPlayer();
    const dealer = this.game.getDealer();

    if (gameState.gameInProgress) {
      document.getElementById('betSection')!.style.display = 'none';
      document.getElementById('gameArea')!.style.display = 'flex';
      document.getElementById('gameControls')!.style.display = 'block';
      document.getElementById('gameBet')!.textContent = gameState.currentBet.toString();
    } else {
      // Game ended - check for win/lose sounds
      if (gameState.message.includes('win') || gameState.message.includes('Win')) {
        AudioManager.playWinSound();
      } else if (gameState.message.includes('lose') || gameState.message.includes('Lose') || gameState.message.includes('Bust')) {
        AudioManager.playLoseSound();
      }
    }

    // Update player cards and score
    const playerCardsDiv = document.getElementById('playerCards')!;
    playerCardsDiv.innerHTML = '';
    player.hand.forEach(card => {
      playerCardsDiv.appendChild(this.createCardElement(card));
    });
    document.getElementById('playerScore')!.textContent = `Score: ${player.score}`;

    // Update dealer cards and score
    const dealerCardsDiv = document.getElementById('dealerCards')!;
    dealerCardsDiv.innerHTML = '';
    dealer.hand.forEach((card, index) => {
      if (index === 0 && gameState.gameInProgress) {
        dealerCardsDiv.appendChild(this.createHiddenCardElement());
      } else {
        dealerCardsDiv.appendChild(this.createCardElement(card));
      }
    });

    const dealerScore = gameState.gameInProgress ? '?' : dealer.score;
    document.getElementById('dealerScore')!.textContent = `Score: ${dealerScore}`;

    // Update balance
    document.getElementById('balance')!.textContent = player.balance.toString();

    // Update message
    this.showMessage(gameState.message);

    // Enable/disable double down button
    const doubleBtn = document.getElementById('doubleBtn')!;
    doubleBtn.disabled = !player.canDoubleDown || gameState.currentBet > player.balance;
  }

  private createCardElement(card: Card): HTMLElement {
    const cardDiv = document.createElement('div');
    const isRed = card.suit === '♥' || card.suit === '♦';
    cardDiv.className = `card ${isRed ? 'red' : 'black'}`;

    cardDiv.innerHTML = `
      <div class="card-value">${card.value}${card.suit}</div>
      <div class="card-suit">${card.suit}</div>
      <div class="card-value bottom">${card.value}${card.suit}</div>
    `;

    return cardDiv;
  }

  private createHiddenCardElement(): HTMLElement {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card hidden';
    cardDiv.textContent = '🂠';
    return cardDiv;
  }

  private showMessage(msg: string): void {
    document.getElementById('message')!.textContent = msg;
  }
}

// Global functions for HTML onclick
declare global {
  interface Window {
    selectChip: (value: number) => void;
    startGame: () => void;
    hit: () => void;
    stand: () => void;
    doubleDown: () => void;
    newGame: () => void;
  }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const ui = new BlackjackUI();

  // Expose functions to global scope for HTML onclick
  window.addToBet = ui.addToBet.bind(ui);
  window.clearBet = ui.clearBet.bind(ui);
  window.startGame = ui.startGame.bind(ui);
  window.hit = ui.hit.bind(ui);
  window.stand = ui.stand.bind(ui);
  window.doubleDown = ui.doubleDown.bind(ui);
  window.newGame = ui.newGame.bind(ui);
});