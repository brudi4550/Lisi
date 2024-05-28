import React, { useState, useEffect, useRef } from "react";
import "./GamePage.css";

const GamePage = () => {
  const [carPosition, setCarPosition] = useState(50);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const gameAreaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (gameOver || !gameStarted) return;

    if (e.key === "ArrowLeft" && carPosition > 0) {
      setCarPosition((prev) => prev - 5);
    } else if (e.key === "ArrowRight" && carPosition < 100) {
      setCarPosition((prev) => prev + 5);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [carPosition, gameOver, gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameInterval = setInterval(() => {
      if (gameOver) return;

      setTimeLeft((prev) => {
        if (prev === 0) {
          setGameOver(true);
          setGameStarted(false);
          return prev;
        }
        return prev - 1;
      });

      setObstacles((prev) => {
        const newObstacles = prev.map((obstacle) => ({
          ...obstacle,
          y: obstacle.y + 5,
        }));

        newObstacles.forEach((obstacle) => {
          if (
            obstacle.y >= 90 &&
            obstacle.y <= 100 &&
            Math.abs(obstacle.x - carPosition) < 10
          ) {
            setGameOver(true);
            setGameStarted(false);
          }
        });

        const filteredObstacles = newObstacles.filter((obstacle) => obstacle.y < 100);
        if (Math.random() < 0.1) {
          filteredObstacles.push({
            x: Math.random() * 100,
            y: 0,
          });
        }

        setScore((prev) => prev + 1);
        return filteredObstacles;
      });
    }, 100);

    return () => clearInterval(gameInterval);
  }, [carPosition, gameOver, gameStarted]);

  const startGame = () => {
    setCarPosition(50);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setTimeLeft(60);
  };

  return (
    <div className="game-container" ref={gameAreaRef}>
      {!gameStarted && (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      )}
      {gameOver && <div className="game-over">Game Over! Score: {score}</div>}
      <div className="car" style={{ left: `${carPosition}%` }} />
      {obstacles.map((obstacle, index) => (
        <div
          key={index}
          className="obstacle"
          style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%` }}
        />
      ))}
      <div className="score">Score: {score}</div>
      <div className="time-left">Time Left: {timeLeft} seconds</div>
    </div>
  );
};

export default GamePage;