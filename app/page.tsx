'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Button from './components/Button';
import Input from './components/Input';

let socket: Socket | null = null;

export default function Home() {
  const [gameState, setGameState] = useState<'initial' | 'new' | 'join' | 'waiting' | 'ready'>('initial');
  const [error, setError] = useState<string>('');
  const [partyCode, setPartyCode] = useState<string>('');
  const [joinCode, setJoinCode] = useState<string>('');
  const [shipCount, setShipCount] = useState<number>(3);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io('http://localhost:3001');

      socket.on('connect', () => {
        setIsConnected(true);
      });

      socket.on('createParty', (data) => {
        if (data.status === 'Success') {
          setPartyCode(data.matchId);
          setGameState('waiting');
        } else {
          setError(`Failed to Create Party: ${data.reason}`);
          setGameState('initial');
        }
      });

      socket.on('joinParty', (data) => {
        if (data.status === 'Success') {
          setGameState('ready');
        } else {
          setError(`Failed to Join Party: ${data.reason}`);
          setGameState('initial');
        }
      });

      socket.on('opponentJoined', (data) => {
        if (data.status === 'Success') {
          setGameState('ready');
        }
      });

      socket.on('startRound', (data) => {
        if (data.status === 'Success') {
          window.location.href = '/game';
        } else {
          setError(`Fatal Error: Failed to Start Round: ${data.reason}`);
          setGameState('initial');
        }
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const handleCreateGame = () => {
    if (socket) {
      socket.emit('tryCreateParty', shipCount);
    }
  };

  const handleJoinGame = () => {
    if (socket && joinCode) {
      socket.emit('tryJoinParty', joinCode);
    }
  };

  const handleStartGame = () => {
    if (socket) {
      socket.emit('tryStartRound', {});
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1>Connecting to Battleship Server...</h1>
        <p className="text-gray-400">
          If this message persists, please make sure that you are running the battleship server program
          on the local computer.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1>Let's Play Battleship</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-8">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {gameState === 'initial' && (
        <div className="space-x-4">
          <Button onClick={() => setGameState('new')}>New Game</Button>
          <Button onClick={() => setGameState('join')}>Join Game</Button>
        </div>
      )}

      {gameState === 'new' && (
        <div className="max-w-md mx-auto">
          <h2>Number of Ships</h2>
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((num) => (
              <Button
                key={num}
                onClick={() => setShipCount(num)}
                variant={shipCount === num ? 'primary' : 'secondary'}
                className="py-3"
              >
                {num}
              </Button>
            ))}
          </div>
          <Button onClick={handleCreateGame}>Create Game</Button>
        </div>
      )}

      {gameState === 'join' && (
        <div className="max-w-md mx-auto space-y-4">
          <h2>Join Game</h2>
          <Input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter party code"
            error={error}
          />
          <Button onClick={handleJoinGame} fullWidth>
            Join
          </Button>
        </div>
      )}

      {gameState === 'waiting' && (
        <div className="max-w-md mx-auto space-y-8">
          <div>
            <h2>Party Code</h2>
            <p className="text-gray-400 mb-2">
              Share this code with your opponent so they can join the round!
            </p>
            <div className="text-4xl font-mono bg-gray-800 rounded-lg py-4">
              {partyCode}
            </div>
          </div>
          <Button onClick={handleStartGame} fullWidth>
            Start Game
          </Button>
        </div>
      )}

      {gameState === 'ready' && (
        <div className="max-w-md mx-auto">
          <h2>Ready to Play!</h2>
          <p className="text-gray-400 mb-8">
            Waiting for the host to start the game...
          </p>
        </div>
      )}
    </div>
  );
} 