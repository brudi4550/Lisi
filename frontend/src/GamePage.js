import React, { useState, useEffect, useRef, useCallback } from "react";
import "./GamePage.css";
import carImage from "./images/f1.png";
import obstacleImage from "./images/blockade.png";

const GamePage = () => {
  const [carPosition, setCarPosition] = useState(50);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const gameAreaRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastScoreUpdateTime = useRef(Date.now());

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

  const checkCollision = (car, obstacle) => {
    const carWidth = 10; // assuming the car is 10% wide
    const carHeight = 20; // assuming the car is 20% tall
    const obstacleWidth = 10; // assuming the obstacle is 10% wide
    const obstacleHeight = 10; // assuming the obstacle is 10% tall

    return (
      car.x < obstacle.x + obstacleWidth &&
      car.x + carWidth > obstacle.x &&
      car.y < obstacle.y + obstacleHeight &&
      car.y + carHeight > obstacle.y
    );
  };

  const gameLoop = useCallback(() => {
    if (gameOver || !gameStarted || gameWon) return;

    setObstacles((prev) => {
      const newObstacles = prev.map((obstacle) => ({
        ...obstacle,
        y: obstacle.y + (0.5 + level * 0.5),
      }));

      newObstacles.forEach((obstacle) => {
        const car = { x: carPosition, y: 80 }; // assuming the car is always at y: 80%
        if (checkCollision(car, obstacle)) {
          console.log("Collision detected");
          setGameOver(true);
          setGameStarted(false);
        }
      });

      const filteredObstacles = newObstacles.filter(
        (obstacle) => obstacle.y < 100
      );
      if (Math.random() < 0.02 + level * 0.01) {
        filteredObstacles.push({
          x: Math.random() * 90, // Adjust to ensure the obstacle stays within bounds
          y: 0,
        });
      }

      return filteredObstacles;
    });

    const now = Date.now();
    const scoreInterval = 1000 / (1 + level * 0.2); // Adjust interval based on level (faster with higher levels)
    if (now - lastScoreUpdateTime.current >= scoreInterval) {
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
      lastScoreUpdateTime.current = now;
    }

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [carPosition, gameOver, gameStarted, level, gameWon]);

  useEffect(() => {
    if (gameStarted && !gameWon && !gameOver) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }

    return () => cancelAnimationFrame(animationFrameId.current);
  }, [gameStarted, gameWon, gameOver, gameLoop]);

  const startGame = () => {
    setCarPosition(50);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setLevel(1);
    setGameWon(false);
    lastScoreUpdateTime.current = Date.now();
  };

  return (
    <div className="game-container" ref={gameAreaRef}>
      {!gameStarted && !gameOver && !gameWon && (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      )}
      {gameOver && (
        <>
          <div className="overlay"></div>
          <div className="modal">
            <div>Game Over! Score: {score}</div>
            <button onClick={startGame}>Restart</button>
          </div>
        </>
      )}
      {gameWon && (
        <>
          <div className="overlay"></div>
          <div className="modal">
            <div>
              Congratulations! You've won a test drive with a leasing car!
            </div>
            <button onClick={startGame}>Restart</button>
          </div>
        </>
      )}
      <div
        className="car"
        style={{
          left: `${carPosition}%`,
          backgroundImage: `url(${carImage})`,
        }}
        alt="Car"
      />
      {obstacles.map((obstacle, index) => (
        <div
          key={index}
          className="obstacle"
          style={{
            left: `${obstacle.x}%`,
            top: `${obstacle.y}%`,
            backgroundImage: `url(${obstacleImage})`,
          }}
          alt="Obstacle"
        />
      ))}
      <div className="score">Score: {score}</div>
      <div className="level">Level: {level}</div>
    </div>
  );
};

export default GamePage;
