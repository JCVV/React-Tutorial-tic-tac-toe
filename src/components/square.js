import React from "react";

const Square = (props) => {
    let className = ['square'];

    if(props.isNextToDelete) {
        className.push('delete');
    }

    if(props.isWinner) {
        className.push('winner');
    }

    return(
        <button className={className.join(' ')} onClick={props.onClick}>
            {props.value}
        </button>
    );
};

export default Square;