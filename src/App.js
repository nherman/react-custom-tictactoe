import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: [],
      message: "",
      gameOver: false,
      isPlayerTurn: false
    };

    this.playerToken = "X";
    this.aiToken = "O";

    this.move = this.move.bind(this);
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

  aiAction() {
    //get best move from minmax
    //call move()
    console.log("ai action");
    this.move(this.aiToken,0);
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
  }

  handleClick(index) {
    console.log(this.state.isPlayerTurn);
    if (this.state.isPlayerTurn) {
      this.move(this.playerToken, index);
      this.aiAction();
    }
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
      </div>
    );
  }
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
