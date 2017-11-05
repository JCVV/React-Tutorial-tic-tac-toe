import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return(
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {

    renderSquare(i) {
        return <Square 
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}/>;
    }

    render() {
        let rows = [];

        for(let x = 0; x < 3; x++){
            let cells = [];
            for(let y = 0; y < 3; y++){
                let square = this.renderSquare(3 * x + y);
                cells.push(square);
            }
            const row = <div key={x} className='board-row'> {cells} </div>
            rows.push(row);
        }

        return rows;
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastClicked: null
            }],
            xIsNext: true,
            stepNumber: 0,
            selectedItem: null,
            reverseListOrder: false
        };
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const selected = this.state.selectedItem;
        const moves = this.getMovesList(history, selected);
        let status;

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div className="game">
            <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}/>
            </div>
            <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.setState({reverseListOrder: !this.state.reverseListOrder})}>Reverse order</button>
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const x = Math.trunc(i/3) + 1;
        const y = i%3 + 1;
        const lastClicked = '(' + x + ',' + y + ')';
        
        this.setState({
            history: history.concat([{
                squares: squares,
                lastClicked: lastClicked
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    getMovesList(history, selected) {
        const reverse = this.state.reverseListOrder;
        let movesList = [];
        for(let i = 0; i < history.length; i++) {
            const step = history[i];
            let desc = i ?
                'Go to move #' + i + ' last move done in ' + step.lastClicked:
                'Go to game start';

            desc = (i === selected) ? desc = <b>{desc}</b> : desc;
            
            const moveElement = <li key={i}>
                    <button onClick={() => this.jumpTo(i)}>{desc}</button>
                </li>;
            
            if(reverse) {
                movesList.unshift(moveElement);
            } else {
                movesList.push(moveElement);
            }
        }
        return movesList;
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step%2 === 0,
            selectedItem: step
        });
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
  // ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  