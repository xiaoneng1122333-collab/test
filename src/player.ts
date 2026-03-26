import { Card } from './types';

export class Player {
  hand: Card[] = [];
  score: number = 0;
  isBusted: boolean = false;
  hasBlackjack: boolean = false;

  constructor(public name: string, public balance: number = 1000) {}

  addCard(card: Card): void {
    this.hand.push(card);
    this.updateScore();
  }

  private updateScore(): void {
    this.score = this.calculateScore();

    if (this.score === 21 && this.hand.length === 2) {
      this.hasBlackjack = true;
    } else if (this.score > 21) {
      this.isBusted = true;
    }
  }

  private calculateScore(): number {
    let score = this.hand.reduce((sum, card) => sum + this.getCardValue(card), 0);
    let aces = this.hand.filter(card => card.value === 'A').length;

    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  }

  private getCardValue(card: Card): number {
    switch (card.value) {
      case 'A': return 11;
      case 'K':
      case 'Q':
      case 'J': return 10;
      default: return parseInt(card.value);
    }
  }

  clearHand(): void {
    this.hand = [];
    this.score = 0;
    this.isBusted = false;
    this.hasBlackjack = false;
  }

  placeBet(amount: number): boolean {
    if (amount <= this.balance) {
      this.balance -= amount;
      return true;
    }
    return false;
  }

  win(amount: number): void {
    this.balance += amount;
  }

  get canDoubleDown(): boolean {
    return this.hand.length === 2;
  }
}