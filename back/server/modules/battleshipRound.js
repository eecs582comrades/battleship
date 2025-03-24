/* fightboatRound.js
Description: Handles game logic and state management for fightboat rounds
Inputs: None
Outputs: Game state and logic
Sources: None
Authors: William Johnson
Creation date: 9-11-24
*/

//data structure for a fightboat round
class FightboatRound {
    constructor() {
        this.ships = [];
        this.hits = [];
        this.misses = [];
        this.currentTurn = null;
        this.gameOver = false;
        this.winner = null;
    }

    // Add a ship to the round
    addShip(ship) {
        this.ships.push(ship);
    }

    // Process a hit attempt
    processHit(x, y) {
        // Check if the hit is valid
        if (this.isValidHit(x, y)) {
            // Check if the hit landed on a ship
            const hitShip = this.findShipAt(x, y);
            if (hitShip) {
                this.hits.push({ x, y });
                this.checkShipSunk(hitShip);
                return { status: "Success", message: "Hit!" };
            } else {
                this.misses.push({ x, y });
                return { status: "Success", message: "Miss!" };
            }
        }
        return { status: "Error", message: "Invalid hit location" };
    }

    // Check if a hit location is valid
    isValidHit(x, y) {
        return x >= 0 && x < 10 && y >= 0 && y < 10 &&
               !this.hits.some(hit => hit.x === x && hit.y === y) &&
               !this.misses.some(miss => miss.x === x && miss.y === y);
    }

    // Find a ship at the given coordinates
    findShipAt(x, y) {
        return this.ships.find(ship => 
            ship.coordinates.some(coord => coord.x === x && coord.y === y)
        );
    }

    // Check if a ship is sunk
    checkShipSunk(ship) {
        const shipHits = this.hits.filter(hit => 
            ship.coordinates.some(coord => coord.x === hit.x && coord.y === hit.y)
        );

        if (shipHits.length === ship.coordinates.length) {
            ship.sunk = true;
            this.checkGameOver();
        }
    }

    // Check if the game is over
    checkGameOver() {
        if (this.ships.every(ship => ship.sunk)) {
            this.gameOver = true;
            this.winner = this.currentTurn;
        }
    }

    // Set the current turn
    setCurrentTurn(playerId) {
        this.currentTurn = playerId;
    }

    // Get the current game state
    getGameState() {
        return {
            ships: this.ships,
            hits: this.hits,
            misses: this.misses,
            currentTurn: this.currentTurn,
            gameOver: this.gameOver,
            winner: this.winner
        };
    }
}

module.exports = FightboatRound;