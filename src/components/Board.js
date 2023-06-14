import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pawn from "./Pawn";

function Board({
  board,
  setBoard,
  turn,
  currentCount,
  setCurrentCount,
  setTurn,
  setMessage,
  gameOver,
  setGameOver,
}) {
  const isInAMill = (currBoard, boardNo, i, j, currVal) => {
    // Checking current row
    if (
      (i === 0 || i === 2) &&
      currBoard[boardNo][i][0] === currVal &&
      currBoard[boardNo][i][1] === currVal &&
      currBoard[boardNo][i][2] === currVal
    ) {
      return true;
    }

    // Checking current column
    if (
      (j === 0 || j === 2) &&
      currBoard[boardNo][0][j] === currVal &&
      currBoard[boardNo][1][j] === currVal &&
      currBoard[boardNo][2][j] === currVal
    ) {
      return true;
    }

    // Checking inter connectivity mill
    if (
      (i === 1 || j === 1) &&
      currBoard[0][i][j] === currVal &&
      currBoard[1][i][j] === currVal &&
      currBoard[2][i][j] === currVal
    ) {
      return true;
    }

    return false;
  };

  const areAllInMill = (board, piece) => {
    let count = 0;
    // If any of the side has a mill by user of current turn, Send message
    for (let boardNo = 0; boardNo <= 2; boardNo++) {
      for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
          if (isInAMill(board, boardNo, i, j, piece)) count++;
        }
      }
    }
    if (currentCount[piece - 1].onBoard === count) return true;
    return false;
  };

  // If moves are greater than 18, then moving can be started
  const [moves, setMoves] = useState(0);
  const [isBeingMoved, setIsBeingMoved] = useState(false);
  const [prevCoords, setPrevCoords] = useState([]);
  const [isBeingRemoved, setIsBeingRemoved] = useState(false);
  const [removedAfterMoved, setRemovedAfterMoved] = useState(false);

  // Remove Piece
  const remove = (boardNo, i, j) => {
    if (board[boardNo][i][j] === turn) {
      setMessage(
        <div className="text-warning">You cannot remove your piece</div>
      );
      return;
    }

    if (board[boardNo][i][j] === 0) {
      setMessage(
        <div className="text-warning">Please select a place with a piece</div>
      );
      return;
    }

    if (areAllInMill(board, board[boardNo][i][j])) {
      setMessage(
        <div className="text-warning">
          All opponent's piece are in mill! So cannot remove any piece
        </div>
      );
    } else if (isInAMill(board, boardNo, i, j, board[boardNo][i][j])) {
      setMessage(
        <div className="text-warning">The selected piece is in a mill</div>
      );
      return;
    } else {
      board[boardNo][i][j] = 0;
      setBoard(board);

      turn = turn === 1 ? 2 : 1;
      setTurn(turn);

      // Opposite turn must be effected, so count is changed after changing turns
      currentCount[turn - 1].onBoard--;
      currentCount[turn - 1].dead++;
      setCurrentCount(currentCount);
      setMessage();

      setIsBeingRemoved(false);

      setMoves(moves + 1);

      // If any player's pieces fall under 2, they lose
      if (moves >= 18 && currentCount[0].onBoard < 3) {
        setMessage(
          <div className="text-orange">
            Player 2 wins! <br /> Please reset the game!
          </div>
        );
        setGameOver(true);
      } else if (moves >= 18 && currentCount[1].onBoard < 3) {
        setMessage(
          <div className="text-orange">
            Player 1 wins! <br /> Please reset the game!
          </div>
        );
        setGameOver(true);
      }
      return;
    }

    turn = turn === 1 ? 2 : 1;
    setTurn(turn);

    setMessage();

    setIsBeingRemoved(false);

    setMoves(moves + 1);

    // If any player's pieces fall under 2, they lose
    if (moves >= 18 && currentCount[0].onBoard < 3) {
      setMessage(
        <div className="text-orange">
          Player 2 wins! <br /> Please reset the game!
        </div>
      );
      setGameOver(true);
    } else if (moves >= 18 && currentCount[1].onBoard < 3) {
      setMessage(
        <div className="text-orange">
          Player 1 wins! <br /> Please reset the game!
        </div>
      );
      setGameOver(true);
    }
  };

  // Change on click
  const change = (boardNo, i, j) => {
    // If game over, reset game
    if (gameOver) return;

    // Removing if a mill occurs
    if (isBeingRemoved) {
      remove(boardNo, i, j);
      return;
    }

    // If mill occurs after moving a piece
    if (removedAfterMoved) {
      setMessage();

      setMoves(moves + 1);

      setPrevCoords([]);

      setIsBeingMoved(false);
      setRemovedAfterMoved(false);

      return;
    }

    // Step after movement
    if (isBeingMoved) {
      // Can move to current location only if it is free
      if (board[boardNo][i][j] !== 0) {
        setMessage(
          <div className="text-warning">Please select an empty location!</div>
        );
        return;
      }

      // Check if prev piece can be moved to current location
      const [prevBoardNo, prevI, prevJ] = prevCoords;

      let canMove = false;

      // If player has only 3 pieces, he can move to anywhere
      if (currentCount[turn - 1].active === 3) canMove = true;

      if (i === 1 || j === 1) {
        if (prevBoardNo - 1 === boardNo || prevBoardNo + 1 === boardNo) {
          canMove = true;
        }
      }

      if (
        (prevI - 1 === i && prevJ === j) ||
        (prevI + 1 === i && prevJ === j) ||
        (prevJ - 1 === j && prevI === i) ||
        (prevJ + 1 === j && prevI === i)
      ) {
        canMove = true;
      }

      if (!canMove) {
        setMessage(
          <div className="text-warning">
            Please select a location connected to previously selected piece!
          </div>
        );
        return;
      }

      // Move the current piece
      board[prevBoardNo][prevI][prevJ] = 0;
      board[boardNo][i][j] = turn;
      setBoard(board);

      if (isInAMill(board, boardNo, i, j, turn)) {
        setIsBeingRemoved(true);
        setMessage(<div className="text-warning">Please remove a piece</div>);
        setRemovedAfterMoved(true);
        setIsBeingMoved(false);
        return;
      }

      turn = turn === 1 ? 2 : 1;
      setTurn(turn);

      setMessage();

      setMoves(moves + 1);

      setPrevCoords([]);

      setIsBeingMoved(false);

      return;
    }

    // Enabling Movement
    if (moves >= 18) {
      // If the selected piece is not current turn's piece, don't select it
      if (board[boardNo][i][j] !== turn) {
        setMessage(
          <div className="text-warning">Please select one of your pieces!</div>
        );
        return;
      }

      // Check if selected piece can move to side or not
      let canMove = false;
      if (i === 1 || j === 1) {
        if (
          (boardNo - 1 >= 0 && board[boardNo - 1][i][j] === 0) ||
          (boardNo + 1 <= 2 && board[boardNo + 1][i][j] === 0)
        ) {
          canMove = true;
        }
      }

      if (
        (i - 1 >= 0 && board[boardNo][i - 1][j] === 0) ||
        (i + 1 <= 2 && board[boardNo][i + 1][j] === 0) ||
        (j - 1 >= 0 && board[boardNo][i][j - 1] === 0) ||
        (j + 1 <= 2 && board[boardNo][i][j + 1] === 0)
      ) {
        canMove = true;
      }

      if (!canMove) {
        setMessage(
          <div className="text-warning">
            The selected piece cannot move! Please select another piece
          </div>
        );
        return;
      }

      // Select current piece and store it to check in next step
      setMessage(<div>Select next destination!</div>);
      setPrevCoords([boardNo, i, j]);
      setIsBeingMoved(true);
      return;
    }

    // If not being moved or removed, the piece is being set in current place, So change current board
    if (board[boardNo][i][j] !== 0) {
      setMessage(
        <div className="text-warning">
          A piece already exists! Choose another place
        </div>
      );
      return;
    }

    board[boardNo][i][j] = turn;
    setBoard(board);

    currentCount[turn - 1].active--;
    currentCount[turn - 1].onBoard++;
    setCurrentCount(currentCount);

    if (isInAMill(board, boardNo, i, j, turn)) {
      setIsBeingRemoved(true);
      setMessage(<div className="text-warning">Please remove a piece</div>);
      return;
    }

    turn = turn === 1 ? 2 : 1;
    setTurn(turn);

    setMessage();

    setMoves(moves + 1);
  };

  return (
    <Container className="p-3 mb-3 board">
      <Row>
        <Col onClick={() => change(0, 0, 0)}>
          <img src="./assets/top-left.png" alt="" />
          {board[0][0][0] !== 0 && <Pawn id={board[0][0][0]} />}
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col onClick={() => change(0, 0, 1)}>
          <img src="./assets/left-bottom-right.png" alt="" />
          {board[0][0][1] !== 0 && <Pawn id={board[0][0][1]} />}
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col onClick={() => change(0, 0, 2)}>
          <img src="./assets/top-right.png" alt="" />
          {board[0][0][2] !== 0 && <Pawn id={board[0][0][2]} />}
        </Col>
      </Row>

      <Row>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
        <Col onClick={() => change(1, 0, 0)}>
          <img src="./assets/top-left.png" alt="" />
          {board[1][0][0] !== 0 && <Pawn id={board[1][0][0]} />}
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col onClick={() => change(1, 0, 1)}>
          <img src="./assets/all.png" alt="" />
          {board[1][0][1] !== 0 && <Pawn id={board[1][0][1]} />}
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col onClick={() => change(1, 0, 2)}>
          <img src="./assets/top-right.png" alt="" />
          {board[1][0][2] !== 0 && <Pawn id={board[1][0][2]} />}
        </Col>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
      </Row>

      <Row>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
        <Col onClick={() => change(2, 0, 0)}>
          <img src="./assets/top-left.png" alt="" />
          {board[2][0][0] !== 0 && <Pawn id={board[2][0][0]} />}
        </Col>
        <Col onClick={() => change(2, 0, 1)}>
          <img src="./assets/left-top-right.png" alt="" />
          {board[2][0][1] !== 0 && <Pawn id={board[2][0][1]} />}
        </Col>
        <Col onClick={() => change(2, 0, 2)}>
          <img src="./assets/top-right.png" alt="" />
          {board[2][0][2] !== 0 && <Pawn id={board[2][0][2]} />}
        </Col>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
      </Row>

      <Row>
        <Col onClick={() => change(0, 1, 0)}>
          <img src="./assets/top-right-bottom.png" alt="" />
          {board[0][1][0] !== 0 && <Pawn id={board[0][1][0]} />}
        </Col>
        <Col onClick={() => change(1, 1, 0)}>
          <img src="./assets/all.png" alt="" />
          {board[1][1][0] !== 0 && <Pawn id={board[1][1][0]} />}
        </Col>
        <Col onClick={() => change(2, 1, 0)}>
          <img src="./assets/top-left-bottom.png" alt="" />
          {board[2][1][0] !== 0 && <Pawn id={board[2][1][0]} />}
        </Col>
        <Col></Col>
        <Col onClick={() => change(2, 1, 2)}>
          <img src="./assets/top-right-bottom.png" alt="" />
          {board[2][1][2] !== 0 && <Pawn id={board[2][1][2]} />}
        </Col>
        <Col onClick={() => change(1, 1, 2)}>
          <img src="./assets/all.png" alt="" />
          {board[1][1][2] !== 0 && <Pawn id={board[1][1][2]} />}
        </Col>
        <Col onClick={() => change(0, 1, 2)}>
          <img src="./assets/top-left-bottom.png" alt="" />
          {board[0][1][2] !== 0 && <Pawn id={board[0][1][2]} />}
        </Col>
      </Row>

      <Row>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
        <Col onClick={() => change(2, 2, 0)}>
          <img src="./assets/bottom-left.png" alt="" />
          {board[2][2][0] !== 0 && <Pawn id={board[2][2][0]} />}
        </Col>
        <Col onClick={() => change(2, 2, 1)}>
          <img src="./assets/left-bottom-right.png" alt="" />
          {board[2][2][1] !== 0 && <Pawn id={board[2][2][1]} />}
        </Col>
        <Col onClick={() => change(2, 2, 2)}>
          <img src="./assets/bottom-right.png" alt="" />
          {board[2][2][2] !== 0 && <Pawn id={board[2][2][2]} />}
        </Col>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
      </Row>

      <Row>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
        <Col onClick={() => change(1, 2, 0)}>
          <img src="./assets/bottom-left.png" alt="" />
          {board[1][2][0] !== 0 && <Pawn id={board[1][2][0]} />}
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col onClick={() => change(1, 2, 1)}>
          <img src="./assets/all.png" alt="" />
          {board[1][2][1] !== 0 && <Pawn id={board[1][2][1]} />}
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col onClick={() => change(1, 2, 2)}>
          <img src="./assets/bottom-right.png" alt="" />
          {board[1][2][2] !== 0 && <Pawn id={board[1][2][2]} />}
        </Col>
        <Col>
          <img src="./assets/vertical.png" alt="" />
        </Col>
      </Row>

      <Row>
        <Col onClick={() => change(0, 2, 0)}>
          <img src="./assets/bottom-left.png" alt="" />
          {board[0][2][0] !== 0 && <Pawn id={board[0][2][0]} />}
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col onClick={() => change(0, 2, 1)}>
          <img src="./assets/left-top-right.png" alt="" />
          {board[0][2][1] !== 0 && <Pawn id={board[0][2][1]} />}
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col>
          <img src="./assets/horizontal.png" alt="" />
        </Col>
        <Col onClick={() => change(0, 2, 2)}>
          <img src="./assets/bottom-right.png" alt="" />
          {board[0][2][2] !== 0 && <Pawn id={board[0][2][2]} />}
        </Col>
      </Row>
    </Container>
  );
}

export default Board;
