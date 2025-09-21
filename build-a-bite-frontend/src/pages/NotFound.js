import React, { useState, useEffect } from 'react';

function NotFound() {
  const emptyBoard = Array(9).fill('');
  const [board, setBoard] = useState(emptyBoard);
  const [userSymbol, setUserSymbol] = useState('X');
  const [computerSymbol, setComputerSymbol] = useState('O');
  const [message, setMessage] = useState("Server under construction, so let's play a game instead ");
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  // Check for win
  const checkWinner = (b, symbol) => {
    const winCombos = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // columns
      [0,4,8],[2,4,6]          // diagonals
    ];
    return winCombos.some(combo => combo.every(i => b[i] === symbol));
  };

  // Handle user's move
  const handleClick = (index) => {
    if (board[index] || gameOver) return;
    const newBoard = [...board];
    newBoard[index] = userSymbol;
    setBoard(newBoard);

    if (checkWinner(newBoard, userSymbol)) {
      setUserScore(prev => prev + 1);
      endRound("You won this round! 🎉");
      return;
    }

    if (newBoard.every(cell => cell)) {
      endRound("It's a tie! 🤷‍♂️");
      return;
    }

    // Computer moves
    setTimeout(() => computerMove(newBoard), 500);
  };

  const computerMove = (currentBoard) => {
    let emptyIndexes = currentBoard.map((val, idx) => val === '' ? idx : null).filter(v => v !== null);
    const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    currentBoard[randomIndex] = computerSymbol;
    setBoard([...currentBoard]);

    if (checkWinner(currentBoard, computerSymbol)) {
      setComputerScore(prev => prev + 1);
      endRound("Computer won this round 😢");
      return;
    }

    if (currentBoard.every(cell => cell)) {
      endRound("It's a tie! 🤷‍♂️");
    }
  };

  const endRound = (roundMessage) => {
    setMessage(roundMessage);
    setGameOver(true);
  };

  const nextRound = () => {
    setRound(prev => prev + 1);
    setBoard(emptyBoard);
    setMessage("Server is still napping, let's go again 😉");
    setGameOver(false);
  };

  const resetGame = () => {
    setBoard(emptyBoard);
    setUserScore(0);
    setComputerScore(0);
    setRound(1);
    setGameOver(false);
    setMessage("Server is gone? Time to play again 😏");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white font-mono p-6">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 text-center">
        Server Temporarily Closed
      </h1>
      <p className="text-gray-300 text-center mb-6">{message}</p>

      <div className="grid grid-cols-3 gap-2 w-64 mb-4">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className="w-16 h-16 text-3xl font-bold bg-gray-800/70 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {cell}
          </button>
        ))}
      </div>

      <p className="mb-4">Round: {round} | You: {userScore} - Computer: {computerScore}</p>

      {gameOver && round < 3 && (
        <button
          onClick={nextRound}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-bold transition-all duration-300 mb-2"
        >
          Next Round
        </button>
      )}

      {round === 3 && gameOver && (
        <button
          onClick={resetGame}
          className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-bold transition-all duration-300 mb-2"
        >
          Restart Game
        </button>
      )}
    </div>
  );
}

export default NotFound;
