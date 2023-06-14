import Navbar from "./components/Navbar";
import Message from "./components/Message";
import Board from "./components/Board";
import Profile from "./components/Profile";
import Reset from "./components/Reset";

import Container from "react-bootstrap/Container";

import { useState } from "react";

function App() {
  // Player's Turn
  const [turn, setTurn] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  // Message to display
  const [message, setMessage] = useState("");

  // Current Count of each player -> Active and Dead Pawns
  const [currentCount, setCurrentCount] = useState([
    { active: 9, onBoard: 0, dead: 0 },
    { active: 9, onBoard: 0, dead: 0 },
  ]);

  // Logic for Nine Men's Morris Board
  const [board, setBoard] = useState([
    [
      [0, 0, 0],
      [0, -1, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, -1, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, -1, 0],
      [0, 0, 0],
    ],
  ]);

  const resetBoard = () => {
    setTurn(1);

    setCurrentCount([
      { active: 9, onBoard: 0, dead: 0 },
      { active: 9, onBoard: 0, dead: 0 },
    ]);

    setBoard([
      [
        [0, 0, 0],
        [0, -1, 0],
        [0, 0, 0],
      ],
      [
        [0, 0, 0],
        [0, -1, 0],
        [0, 0, 0],
      ],
      [
        [0, 0, 0],
        [0, -1, 0],
        [0, 0, 0],
      ],
    ]);

    setMessage("");
  };

  return (
    <div className="App h-100">
      <Navbar />

      <Container className="p-5">
        <Message turn={turn} message={message} />

        <Profile
          id={1}
          currentCount={currentCount}
          setCurrentCount={setCurrentCount}
        />

        <Board
          board={board}
          setBoard={setBoard}
          turn={turn}
          setTurn={setTurn}
          currentCount={currentCount}
          setCurrentCount={setCurrentCount}
          setMessage={setMessage}
          gameOver={gameOver}
          setGameOver={setGameOver}
        />

        <Profile id={2} currentCount={currentCount} />

        <Reset resetBoard={resetBoard} />
      </Container>
    </div>
  );
}

export default App;
