import React, { Component } from 'react';
import { minimax } from 'minimaxtictactoe'; 
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: [],
      winningCombo: [],
      message: "",
      gameOver: false,
      isPlayerTurn: false
    };

    this.playerToken = "X";
    this.aiToken = "O";

    this.reset = this.reset.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.aiAction = this.move.bind(this);
    this.move = this.move.bind(this);
    this.updateGameStatus = this.updateGameStatus.bind(this);
    this.generateMinimaxBoard = this.generateMinimaxBoard.bind(this);
  }
 
  componentDidMount() {
    this.reset();
  }
 
  reset() {
    this.setState({
      game: Array(9).fill(""),
      gameOver: false
    });

    if (Math.floor(Math.random() * 2)) {
      this.setState({
        message: "You go first.",
        isPlayerTurn: true
      });
    } else {
      this.setState({
        message: "I'll start!",
        isPlayerTurn: false
      });
      this.aiAction();
    }

  }

  handleClick(index) {
    if (this.state.isPlayerTurn) {
      this.move(this.playerToken, index);
//      this.aiAction();
    }
  }

  aiAction() {
    let board = this.generateMinimaxBoard();
    console.log(board);
    let bestMove = minimax.getMove(board, this.aiToken, this.playerToken);
    console.log(bestMove);
    this.move(this.aiToken,bestMove.index);
  }

  move(token, sq) {
    console.log("move: " + token + " " + sq);
    this.setState((prevState) => {
      let sqs = prevState.game.slice();
      sqs[sq] = token;

      return {
        game: sqs,
        isPlayerTurn: prevState.isPlayerTurn ? false : true
      }
    });

    this.updateGameStatus();
  }

  updateGameStatus() {
    let msg = "";
    let winning_combo = [];
    let board = this.generateMinimaxBoard();
    let avail = board.filter(s => s !== this.playerToken && s !== this.aiToken)

    console.log(board);
    console.log(avail);


    if (minimax.winning(board, this.aiToken)) {
      msg = "Ha! I never lose."
      winning_combo = minimax.winning_combo(board, this.aiToken)
    } else if (minimax.winning(board, this.playerToken)) {
      msg = "Huh? There must be a bug."
      winning_combo = minimax.winning_combo(board, this.playerToken)
    } else if (avail.length === 0) {
      msg = "Another tie!"
    }

    if (msg !== "") {
      this.setState({
        message: msg,
        gameOver: true,
        winningCombo: winning_combo,
        isPlayerTurn: false
      });
    }

  }

  // generate an array in the format required for minimax: [0, 1, "O", "X", "O", "X", 6, 7, 8]
  // game === this.state.game === [...]
  generateMinimaxBoard(game) {
    var board = [];
    game.map((sq,i) => {
      board[i] = sq !== "" ? sq : i;
    });
    return board;
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title App-logo">Tic Tac Toe</h1>
        </header>
        <p className="App-intro">
          {this.state.message}
        </p>
        <GameBoard
          game={this.state.game}
          handleClick={(i) => this.handleClick(i)}/>

        <ResetButton
          show={this.state.gameOver}
          handleClick={this.reset}/>

      </div>
    );
  }
}

function ResetButton(props) {
  return (
    <div className="btn-wrapper">
      {props.show && 
        <button className="btn-wrapper__button" onClick={props.handleClick}>{props.value || "Play Again?"}</button>
      }
    </div>
  );
}

function GameBoard(props) {
  const renderedSquares = props.game.map((sq,i) => {
    let cls = "square";
    if (i < 6) {
      cls += " square_bottom";
    }
    if ([1,4,7].includes(i)) {
      cls += " square_left-right";
    }

    return (
    <Square key={i}
            value={sq}
            cls={cls}
            onClick={() => {
              props.handleClick(i)
            }}/>
    );
  });

  return (
    <div className="gameBoard"> 
    {renderedSquares}
    </div>
  );

}

function Square(props) {
  return (
    <div className={props.cls} onClick={props.onClick}>{props.value}</div>
  );
}


export default App;
