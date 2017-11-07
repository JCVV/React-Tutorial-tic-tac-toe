import React from "react";
import Square from './square';

class Board extends React.Component {
    
    renderSquare(i) {
        const winner = this.props.winnerCells.includes(i);
        return <Square 
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            winner={winner}/>;
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

export default Board;