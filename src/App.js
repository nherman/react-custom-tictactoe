import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: [],
      message: "",
      gameOver: false
    };

    this.player_token = "X";
    this.ai_token = "O";
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
      this.setState({message: "You go first."});
    } else {
      // this._AIACtion();
      this.setState({message: "I'll start!"});
    }

  }

  handleClick(index) {
    console.log("handleClick: " + index);
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
        <GameBoard game={this.state.game} handleClick={(i) => this.handleClick(i)}/>
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
            onClick={() => props.handleClick(i)}/>
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
