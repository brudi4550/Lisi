import React, { useState, useEffect, useRef } from "react";
import "./GamePage.css";
import carImage from "./f1.png";
import obstacleImage from "./blockade.png";

const GamePage = () => {
  const [carPosition, setCarPosition] = useState(50);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
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
    if (!gameStarted || gameWon) return;

    const gameInterval = setInterval(() => {
      if (gameOver || gameWon) return;

      setObstacles((prev) => {
        const newObstacles = prev.map((obstacle) => ({
          ...obstacle,
          y: obstacle.y + (5 + level),
        }));

        newObstacles.forEach((obstacle) => {
          if (
            obstacle.y >= 90 &&
            obstacle.y <= 100 &&
            Math.abs(obstacle.x - carPosition) < 10
          ) {
            console.log("Collision detected");
            setGameOver(true);
            setGameStarted(false);
          }
        });

        const filteredObstacles = newObstacles.filter(
          (obstacle) => obstacle.y < 100
        );
        if (Math.random() < 0.1 + level * 0.05) {
          filteredObstacles.push({
            x: Math.random() * 100,
            y: 0,
          });
        }

        setScore((prev) => {
          const newScore = prev + 1;
          console.log(`Score: ${newScore}`);
          if (newScore >= 800) {
            setGameWon(true);
            setGameStarted(false);
          } else if (newScore >= 500) {
            setLevel(3);
          } else if (newScore >= 200) {
            setLevel(2);
          }
          return newScore;
        });

        return filteredObstacles;
      });
    }, 200); // Ein längeres Intervall für bessere Debugging

    return () => clearInterval(gameInterval);
  }, [carPosition, gameOver, gameStarted, level, gameWon]);

  const startGame = () => {
    setCarPosition(50);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setLevel(1);
    setGameWon(false);
  };

  return (
    <div className="game-container" ref={gameAreaRef}>
      {!gameStarted && !gameWon && (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      )}
      {gameOver && <div className="game-over">Game Over! Score: {score}</div>}
      {gameWon && (
        <div className="game-won">
          Congratulations! You've won a test drive with a leasing car!
        </div>
      )}
      <div
        className="car"
        src={carImage}
        style={{ left: `${carPosition}%` }}
        alt="Car"
      />
      {obstacles.map((obstacle, index) => (
        <div
          src={obstacleImage}
          key={index}
          className="obstacle"
          style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%` }}
          alt="Obstacle"
        />
      ))}
      <div className="score">Score: {score}</div>
      <div className="level">Level: {level}</div>
    </div>
  );
};

export default GamePage;
