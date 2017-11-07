import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board';
import './style/index.css';

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastClicked: {
                    index: null,
                    position: []
                },
                nextToDeleteIndex: null
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

        if (winner.player) {
            status = 'Winner: ' + winner.player;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div className="game">
            <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                nextToDeleteIndex={current.nextToDeleteIndex}
                winnerCells={winner.cells}/>
            </div>
            <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.setState(prevState => ({reverseListOrder: !prevState.reverseListOrder}))}>Reverse order</button>
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const historyLength = history.length;
        const current = history[historyLength - 1];
        const squares = current.squares.slice();
        const x = Math.trunc(i/3);
        const y = i%3;
        let nextToDeleteIndex = null;
        let lastClicked = {
            index: i,
            position: [x, y]
        };

        if(squares[i]) {
            return;
        }

        if(historyLength > 5) {
            const nextToDelete = history[historyLength - 5].lastClicked;
            nextToDeleteIndex = nextToDelete.index;
        }

        if(historyLength > 6) {
            const removeMovePosition = history[historyLength - 6].lastClicked;
            const removeIndex = removeMovePosition.index;
            squares[removeIndex] = null;
        }
        
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        
        this.setState(prevState => ({
            history: history.concat([{
                squares: squares,
                lastClicked: lastClicked,
                nextToDeleteIndex: nextToDeleteIndex
            }]),
            xIsNext: !prevState.xIsNext,
            stepNumber: history.length
        }));
    }

    getMovesList(history, selected) {
        const reverse = this.state.reverseListOrder;
        let movesList = [];
        for(let i = 0; i < history.length; i++) {
            const step = history[i];
            let desc = i ?
                'Go to move #' + i + ' last move done in ' + step.lastClicked.position:
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
            return {
                player: squares[a],
                cells: [a, b, c]
            };
        }
    }
    return {
        player: null,
        cells: []
    };
}
  // ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  