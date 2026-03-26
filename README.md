# Blackjack Game

A modern, interactive Blackjack game implemented with Node.js and TypeScript, featuring a clean object-oriented design and real-time gameplay.

## Features

- **Complete Blackjack Rules**: Standard 52-card deck, hit/stand/double down actions
- **Smart AI Dealer**: Automated dealer that follows standard casino rules (hits until 17+)
- **Betting System**: Starting balance of 1000, with proper win/loss/payout calculations
- **Blackjack Detection**: Automatic 3:2 payout for natural blackjacks
- **Responsive Design**: Modern web interface built with Vite

## Tech Stack

- **TypeScript** - Type-safe code with ES2020 target
- **Vite** - Fast development server and build tool
- **Node.js** - Runtime environment

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite development server. Open your browser to the displayed URL to play.

### Build

```bash
npm run build
```

Compiles TypeScript and creates a production build in the `dist` directory.

### Preview

```bash
npm run preview
```

Serves the production build locally for testing.

## Game Rules

### Card Values
- Number cards (2-10): Face value
- Face cards (J, Q, K): 10 points
- Ace (A): 11 points, automatically reduces to 1 if player would bust

### Game Flow
1. Place your bet (minimum bet requirements apply)
2. Receive 2 cards face up
3. Dealer receives 1 card face up
4. Choose actions: Hit, Stand, or Double Down
5. Dealer reveals hidden card and plays automatically
6. Winner determined based on standard Blackjack rules

### Payouts
- **Blackjack**: 3:2 (2.5x multiplier)
- **Regular Win**: 2:1 (2x multiplier)
- **Push**: Original bet returned

## Project Structure

```
src/
├── types.ts     # Type definitions
├── card.ts      # PlayingCard class
├── deck.ts      # Deck class with shuffling
├── player.ts    # Player class (human & dealer)
└── game.ts      # BlackjackGame main engine
```

## Architecture

The game follows a clean object-oriented design:

- **BlackjackGame**: Main orchestrator handling game flow and player actions
- **Deck**: Manages card deck with shuffling and drawing functionality
- **Player**: Represents players and dealer with hand management
- **PlayingCard**: Individual card implementation with value calculation

## Development

This project uses TypeScript with strict mode enabled. The configuration supports:

- ES2020 target
- Source maps and declarations
- Clean compilation output to `./dist`

## License

MIT