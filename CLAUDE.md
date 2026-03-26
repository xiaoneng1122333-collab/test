# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Blackjack game implemented with Node.js and TypeScript, using Vite as the build tool and development server.

## Architecture
The project follows a clean object-oriented design with the following key components:

### Core Classes
- **`BlackjackGame`** (`src/game.ts`): Main game engine that orchestrates the entire blackjack game flow, handles player actions (hit, stand, double down), and determines winners
- **`Deck`** (`src/deck.ts`): Manages a standard 52-card deck with shuffling and card drawing functionality
- **`Player`** (`src/player.ts`): Represents both human players and the dealer, tracking hands, scores, balance, and game state (bust, blackjack)
- **`PlayingCard`** (`src/card.ts`): Individual card implementation with suit/value display and numeric value calculation

### Type Definitions
- **`types.ts`**: Central type definitions including `Card`, `Suit`, `CardValue`, `Player`, and `GameState` interfaces

## Development Commands

### Installation
```bash
npm install
```

### Development
```bash
npm run dev  # Start Vite development server
```

### Build
```bash
npm run build  # Compile TypeScript and build with Vite
```

### Preview
```bash
npm run preview  # Preview the built application
```

## Key Implementation Details

### Game Flow
1. Initialize game with `new BlackjackGame(initialBalance)`
2. Start game with `startNewGame(betAmount)` - deals 2 cards to player and dealer
3. Player actions: `hit()`, `stand()`, or `doubleDown()`
4. Game automatically ends when player busts, gets blackjack, or stands
5. Dealer plays automatically when player stands (hits until score ≥ 17)

### Card Value System
- Number cards (2-10): Face value
- Face cards (J, Q, K): 10 points
- Ace (A): 11 points, automatically reduces to 1 if player would bust

### Betting System
- Default starting balance: 1000
- Blackjack pays 3:2 (2.5x multiplier)
- Regular win pays 2:1 (2x multiplier)
- Push returns the original bet

### File Structure
```
src/
├── types.ts     # Type definitions
├── card.ts      # PlayingCard class
├── deck.ts      # Deck class
├── player.ts    # Player class
└── game.ts      # BlackjackGame main engine
```

## TypeScript Configuration
- Target: ES2020
- Strict mode enabled
- Source maps and declarations generated
- Output directory: `./dist`