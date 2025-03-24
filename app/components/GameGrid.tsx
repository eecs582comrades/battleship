import { useState } from 'react';

interface GameGridProps {
  isOpponent?: boolean;
  onCellClick?: (x: number, y: number) => void;
  disabled?: boolean;
  grid?: number[][];
}

export default function GameGrid({ 
  isOpponent = false, 
  onCellClick, 
  disabled = false,
  grid: initialGrid 
}: GameGridProps) {
  const [grid, setGrid] = useState<number[][]>(
    initialGrid || Array(10).fill(Array(10).fill(0))
  );

  const handleCellClick = (x: number, y: number) => {
    if (disabled || !onCellClick) return;
    onCellClick(x, y);
  };

  const getCellColor = (value: number) => {
    switch (value) {
      case 0: return 'bg-blue-900 hover:bg-blue-800'; // Empty
      case 1: return 'bg-gray-600'; // Ship
      case 2: return 'bg-red-600'; // Hit
      case 3: return 'bg-white'; // Miss
      default: return 'bg-blue-900 hover:bg-blue-800';
    }
  };

  return (
    <div className="grid grid-cols-10 gap-1 bg-gray-800 p-4 rounded-lg">
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <button
            key={`${x}-${y}`}
            onClick={() => handleCellClick(x, y)}
            disabled={disabled}
            className={`
              w-10 h-10 rounded transition-colors
              ${getCellColor(cell)}
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          />
        ))
      )}
    </div>
  );
} 