import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [snakeSegments, setSnakeSegments] = useState([{ x: 1, y: 1 }]);
  const [direction, setDirection] = useState("right");
  const [nextDirection, setNextDirection] = useState("right");
  const [snakeSpeed, setSnakeSpeed] = useState(150); // Adjust for speed/responsiveness
  const [gameOver, setGameOver] = useState(false);
  const [apple, setApple] = useState(generateRandomApplePosition());

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          // using if statement to prevent snake from going in the opposite direction
          if (direction !== "down") setNextDirection("up");
          break;
        case "ArrowDown":
          if (direction !== "up") setNextDirection("down");
          break;
        case "ArrowLeft":
          if (direction !== "right") setNextDirection("left");
          break;
        case "ArrowRight":
          if (direction !== "left") setNextDirection("right");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction]);

  useEffect(() => {
    if (gameOver) {
      return;
    }

    const moveSnake = () => {
      const head = { ...snakeSegments[0] };

      // using if statement to prevent snake from going in the opposite direction
      if (
        (nextDirection === "up" && direction !== "down") ||
        (nextDirection === "down" && direction !== "up") ||
        (nextDirection === "left" && direction !== "right") ||
        (nextDirection === "right" && direction !== "left")
      ) {
        setDirection(nextDirection);
      }

      // just changing the x and y coordinates of the head to move snake
      switch (direction) {
        case "up":
          head.y -= 1;
          break;
        case "down":
          head.y += 1;
          break;
        case "left":
          head.x -= 1;
          break;
        case "right":
          head.x += 1;
          break;
        default:
          break;
      }

      // to check if snake hits the wall
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        setGameOver(true);
        return;
      }

      // to check if snake hits itself
      for (let i = 1; i < snakeSegments.length; i++) {
        if (head.x === snakeSegments[i].x && head.y === snakeSegments[i].y) {
          setGameOver(true);
          return;
        }
      }

      // to check if snake eats apple
      if (head.x === apple.x && head.y === apple.y) {
        const newSegment = { ...snakeSegments[snakeSegments.length - 1] };
        snakeSegments.push(newSegment);
        setSnakeSpeed((prev) => prev - 5);
        setApple(generateRandomApplePosition());
      }

      // the last segment is removed to ensure that the snake moves forward without getting longer
      const newSnakeSegments = [head, ...snakeSegments.slice(0, -1)];
      setSnakeSegments(newSnakeSegments);
    };

    // to make snake move automatically on given speed
    const intervalId = setInterval(moveSnake, snakeSpeed);

    return () => {
      clearInterval(intervalId);
    };
  }, [direction, nextDirection, snakeSegments, snakeSpeed, gameOver, apple]);

  function generateRandomApplePosition() {
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 20);
    return { x, y };
  }

  const renderBoard = () => {
    const cells = [];

    for (let i = 0; i < 400; i++) {
      let isSnakeSegment = false;
      if (i === apple.x + apple.y * 20) {
        cells.push(<div key={i} className="snake_game_cell apple"></div>);
      } else {
        for (const segment of snakeSegments) {
          if (i === segment.x + segment.y * 20) {
            isSnakeSegment = true;
            break;
          }
        }
        cells.push(
          <div
            key={i}
            className={`snake_game_cell ${isSnakeSegment ? "snake" : ""}`}
          ></div>
        );
      }
    }

    return cells;
  };

  return (
    <div className="App">
      <h1 className="mb-10">Snake Game</h1>
      <h3>Score: {snakeSegments.length - 1}</h3>
      {gameOver && (
        <div className="snake_game_game_over items-center flex flex-col">
          <h2>Game Over!</h2>
          <button
            className="py-1 rounded max-w-[10rem] bg-gray-300 px-2"
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      )}

      <div className="snake_game_board">{renderBoard()}</div>
    </div>
  );
}

export default App;
