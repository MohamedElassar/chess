import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {getColor} from './utils';
import {pieces} from './initialBoard';
import {startAnalysis} from './startAnalysis';

// just storing a copy of the default chess color puzzle. This is so that we can reset to this set of colors when needed
let default_squareColor = new Array(8).fill("").map((value, index) => new Array(8).fill("").map( (value_2, indexx) => getColor(index, indexx) )  )

const Square = (props) => {
    return(
        <div className="square">
            <button style={{backgroundColor: props.color}} onClick={props.onClick}>
                <div className="piece">
                    <img src={props.image} alt=""></img>
                </div>
            </button>
        </div>
    );
}

class ChessBoard extends React.Component {
    
    renderSquare(i, j){
        return <Square 
                    image={this.props.pieces[i][j].image}  
                    onClick={() => this.props.handleClick(i, j)} 
                    color={this.props.squareColor[i][j]}>
                </Square>
    }

    render(){
        return( 
            <div className="board">
                <div className="row" id="row-0">
                    {this.renderSquare(0, 0)} 
                    {this.renderSquare(0, 1)}
                    {this.renderSquare(0, 2)}
                    {this.renderSquare(0, 3)}
                    {this.renderSquare(0, 4)}
                    {this.renderSquare(0, 5)}
                    {this.renderSquare(0, 6)}
                    {this.renderSquare(0, 7)}
                </div>
                <div className="row" id="row-1">
                    {this.renderSquare(1, 0)}
                    {this.renderSquare(1, 1)}
                    {this.renderSquare(1, 2)}
                    {this.renderSquare(1, 3)}
                    {this.renderSquare(1, 4)}
                    {this.renderSquare(1, 5)}
                    {this.renderSquare(1, 6)}
                    {this.renderSquare(1, 7)}
                </div>
                <div className="row" id="row-2">
                    {this.renderSquare(2, 0)}
                    {this.renderSquare(2, 1)}
                    {this.renderSquare(2, 2)}
                    {this.renderSquare(2, 3)}
                    {this.renderSquare(2, 4)}
                    {this.renderSquare(2, 5)}
                    {this.renderSquare(2, 6)}
                    {this.renderSquare(2, 7)}
                </div>
                <div className="row" id="row-3">
                    {this.renderSquare(3, 0)}
                    {this.renderSquare(3, 1)}
                    {this.renderSquare(3, 2)}
                    {this.renderSquare(3, 3)}
                    {this.renderSquare(3, 4)}
                    {this.renderSquare(3, 5)}
                    {this.renderSquare(3, 6)}
                    {this.renderSquare(3, 7)}
                </div>
                <div className="row" id="row-4">
                    {this.renderSquare(4, 0)}
                    {this.renderSquare(4, 1)}
                    {this.renderSquare(4, 2)}
                    {this.renderSquare(4, 3)}
                    {this.renderSquare(4, 4)}
                    {this.renderSquare(4, 5)}
                    {this.renderSquare(4, 6)}
                    {this.renderSquare(4, 7)}
                </div>
                <div className="row" id="row-5">
                    {this.renderSquare(5, 0)}
                    {this.renderSquare(5, 1)}
                    {this.renderSquare(5, 2)}
                    {this.renderSquare(5, 3)}
                    {this.renderSquare(5, 4)}
                    {this.renderSquare(5, 5)}
                    {this.renderSquare(5, 6)}
                    {this.renderSquare(5, 7)}
                </div>
                <div className="row" id="row-6">
                    {this.renderSquare(6, 0)}
                    {this.renderSquare(6, 1)}
                    {this.renderSquare(6, 2)}
                    {this.renderSquare(6, 3)}
                    {this.renderSquare(6, 4)}
                    {this.renderSquare(6, 5)}
                    {this.renderSquare(6, 6)}
                    {this.renderSquare(6, 7)}
                </div>
                <div className="row" id="row-7">
                    {this.renderSquare(7, 0)}
                    {this.renderSquare(7, 1)}
                    {this.renderSquare(7, 2)}
                    {this.renderSquare(7, 3)}
                    {this.renderSquare(7, 4)}
                    {this.renderSquare(7, 5)}
                    {this.renderSquare(7, 6)}
                    {this.renderSquare(7, 7)}
                </div>
            </div>
        );
    }
}

let TurnTracker = (props) => {
    return(
        <div style={{color: "white"}}>
            {props.value}'s turn
        </div>
    );
}

class App  extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            board: JSON.parse(JSON.stringify(pieces)), //board is an array of the "pieces" object. See ./initialBoard for object properties. Using JSON parse and stringify to deep clone the array "pieces"
            selected_piece: { i : "", j : "", value : "", validCoordinates: [] },
            squareColor: default_squareColor, // squareColor is the 2D array of square colors for the puzzle that is passed every render cycle to the children
            turn: "light"
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(i, j){
        //an object with info about the box we just clicked
        let clicked_piece = this.state.board[i][j];

        let clicked_piece_color = clicked_piece.color;

        if(clicked_piece_color === this.state.turn || clicked_piece_color === "" ){ // only allow plater to move the pieces in the correct turn. if the current turn is white and they click a black piece, no analysis takes place
            // handle the logic of the user clicking on a square in their correct turn
            startAnalysis(this, i, j, clicked_piece, this.state, default_squareColor);
        } else {
            // do nothing; we clicked a piece that we shouldn't control.    
        }
    }

    render(){
        return(
            <div>
                <div id="board-wrapper">
                    <TurnTracker value={this.state.turn} />
                    <ChessBoard pieces={this.state.board} squareColor={this.state.squareColor} handleClick={(i, j) => this.handleClick(i, j)} />
                </div>
            </div>
        );
    }   
}

ReactDOM.render(<App />, document.getElementById("root"));