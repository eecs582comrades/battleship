'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Button from '../components/Button';
import GameGrid from '../components/GameGrid';

let socket: Socket | null = null;

export default function Game() {
  const [grid, setGrid] = useState<number[][]>(Array(10).fill(Array(10).fill(0)));
  const [opponentGrid, setOpponentGrid] = useState<number[][]>(Array(10).fill(Array(10).fill(0)));
  const [isPlacingShips, setIsPlacingShips] = useState(true);
  const [message, setMessage] = useState('Place your ships');

  useEffect(() => {
    if (!socket) {
      socket = io('http://localhost:3001');

      socket.on('gameUpdate', (data) => {
        if (data.type === 'hit') {
          // Handle hit
          const newGrid = [...opponentGrid];
          newGrid[data.y][data.x] = data.hit ? 2 : 3;
          setOpponentGrid(newGrid);
          setMessage(data.hit ? 'Hit!' : 'Miss!');
        } else if (data.type === 'gameOver') {
          setMessage(data.winner ? 'You won!' : 'You lost!');
        }
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [opponentGrid]);

  const handleCellClick = (x: number, y: number, isOpponent: boolean) => {
    if (isPlacingShips && !isOpponent) {
      // Place ship
      const newGrid = [...grid];
      newGrid[y][x] = 1;
      setGrid(newGrid);
      socket?.emit('placeShip', { x, y });
    } else if (!isPlacingShips && isOpponent) {
      // Attack
      socket?.emit('attack', { x, y });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center mb-8">{message}</h1>
      
      <div className="flex justify-center gap-16 mt-8">
        <div>
          <h2 className="text-center mb-4">Your Grid</h2>
          <GameGrid
            grid={grid}
            onCellClick={(x, y) => handleCellClick(x, y, false)}
            disabled={!isPlacingShips}
          />
        </div>
        
        <div>
          <h2 className="text-center mb-4">Opponent's Grid</h2>
          <GameGrid
            grid={opponentGrid}
            onCellClick={(x, y) => handleCellClick(x, y, true)}
            disabled={isPlacingShips}
          />
        </div>
      </div>

      {isPlacingShips && (
        <div className="mt-8 text-center">
          <Button
            onClick={() => {
              setIsPlacingShips(false);
              socket?.emit('readyToPlay');
            }}
            variant="success"
          >
            Ready to Play
          </Button>
        </div>
      )}
    </div>
  );
} 