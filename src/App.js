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
    this.aiAction = this.aiAction.bind(this);
    this.move = this.move.bind(this);
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
      this.move(this.aiToken, Math.floor(Math.random() * 8));
    }

  }

  /* handleClick()
   * capture user clicks and make move if game is in progress
   */
  handleClick(index) {
    if (!this.state.gameOver) {
      this.move(this.playerToken, index);
      this.aiAction();
    }
  }

  /* aiAction()
   * make a move for the ai
   */
  aiAction() {
    this.move(this.aiToken);
  }


  /* move()
   * place token ('X'||'O') on game[square]
   * if square is not provided, calculate the best move
  */
  move(token, sq) {

    //make the move
    this.setState((prevState) => {
      let sqs = prevState.game.slice();

      if (sq === undefined) {
        let board = this.generateMinimaxBoard(sqs);
        let bestMove = minimax.getMove(
                                        board,
                                        token,
                                        (token === this.aiToken ? this.playerToken : this.aiToken)
                                      );

        sq = bestMove.index;
      } else if (/* TODO: return {} if sqs[sq] is occupied */) {

      }

      sqs[sq] = token;

      return {
        game: sqs,
        isPlayerTurn: prevState.isPlayerTurn ? false : true
      }
    });


    //check for end game state
    this.setState((prevState) => {
      let msg = "";
      let winning_combo = [];
      let board = this.generateMinimaxBoard(prevState.game.slice());
      let avail = board.filter(s => s !== this.playerToken && s !== this.aiToken)


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
        return {
          message: msg,
          gameOver: true,
          winningCombo: winning_combo,
          isPlayerTurn: false
        };
      }

      return {};
    });

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
