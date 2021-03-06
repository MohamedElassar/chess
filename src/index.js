import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {getColor} from './highlighting';
import {pieces} from './initialBoard';
import {startAnalysis} from './startAnalysis';

// just storing a copy of the default chess color puzzle. This is so that we can reset to this set of colors when needed
let default_squareColor = new Array(8).fill("").map((value, index) => new Array(8).fill("").map( (value_2, indexx) => getColor(index, indexx) )  )

const Square = (props) => {
    return(
        <div className="square">
            <button style={{backgroundColor: props.color}} onClick={props.onClick}>
                <div className="piece">
                    {props.image ?
                    <img src={props.image} alt=""></img>
                    :
                    <div />
                    }
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

                <div className="col-label-top">
                    <div>a</div>
                    <div>b</div>
                    <div>c</div>
                    <div>d</div>
                    <div>e</div>
                    <div>f</div>
                    <div>g</div>
                    <div>h</div>
                </div>

                <div className="row" id="row-0">
                    <div className="row-label-left">8</div>
                    {this.renderSquare(0, 0)} 
                    {this.renderSquare(0, 1)}
                    {this.renderSquare(0, 2)}
                    {this.renderSquare(0, 3)}
                    {this.renderSquare(0, 4)}
                    {this.renderSquare(0, 5)}
                    {this.renderSquare(0, 6)}
                    {this.renderSquare(0, 7)}
                    <div className="row-label-right">8</div>
                </div>
                <div className="row" id="row-1">
                    <div className="row-label-left">7</div>
                    {this.renderSquare(1, 0)}
                    {this.renderSquare(1, 1)}
                    {this.renderSquare(1, 2)}
                    {this.renderSquare(1, 3)}
                    {this.renderSquare(1, 4)}
                    {this.renderSquare(1, 5)}
                    {this.renderSquare(1, 6)}
                    {this.renderSquare(1, 7)}
                    <div className="row-label-right">7</div>
                </div>
                <div className="row" id="row-2">
                    <div className="row-label-left">6</div>
                    {this.renderSquare(2, 0)}
                    {this.renderSquare(2, 1)}
                    {this.renderSquare(2, 2)}
                    {this.renderSquare(2, 3)}
                    {this.renderSquare(2, 4)}
                    {this.renderSquare(2, 5)}
                    {this.renderSquare(2, 6)}
                    {this.renderSquare(2, 7)}
                    <div className="row-label-right">6</div>
                </div>
                <div className="row" id="row-3">
                    <div className="row-label-left">5</div>
                    {this.renderSquare(3, 0)}
                    {this.renderSquare(3, 1)}
                    {this.renderSquare(3, 2)}
                    {this.renderSquare(3, 3)}
                    {this.renderSquare(3, 4)}
                    {this.renderSquare(3, 5)}
                    {this.renderSquare(3, 6)}
                    {this.renderSquare(3, 7)}
                    <div className="row-label-right">5</div>
                </div>
                <div className="row" id="row-4">
                    <div className="row-label-left">4</div>
                    {this.renderSquare(4, 0)}
                    {this.renderSquare(4, 1)}
                    {this.renderSquare(4, 2)}
                    {this.renderSquare(4, 3)}
                    {this.renderSquare(4, 4)}
                    {this.renderSquare(4, 5)}
                    {this.renderSquare(4, 6)}
                    {this.renderSquare(4, 7)}
                    <div className="row-label-right">4</div>
                </div>
                <div className="row" id="row-5">
                    <div className="row-label-left">3</div>
                    {this.renderSquare(5, 0)}
                    {this.renderSquare(5, 1)}
                    {this.renderSquare(5, 2)}
                    {this.renderSquare(5, 3)}
                    {this.renderSquare(5, 4)}
                    {this.renderSquare(5, 5)}
                    {this.renderSquare(5, 6)}
                    {this.renderSquare(5, 7)}
                    <div className="row-label-right">3</div>
                </div>
                <div className="row" id="row-6">
                    <div className="row-label-left">2</div>
                    {this.renderSquare(6, 0)}
                    {this.renderSquare(6, 1)}
                    {this.renderSquare(6, 2)}
                    {this.renderSquare(6, 3)}
                    {this.renderSquare(6, 4)}
                    {this.renderSquare(6, 5)}
                    {this.renderSquare(6, 6)}
                    {this.renderSquare(6, 7)}
                    <div className="row-label-right">2</div>
                </div>
                <div className="row" id="row-7">
                    <div className="row-label-left">1</div>
                    {this.renderSquare(7, 0)}
                    {this.renderSquare(7, 1)}
                    {this.renderSquare(7, 2)}
                    {this.renderSquare(7, 3)}
                    {this.renderSquare(7, 4)}
                    {this.renderSquare(7, 5)}
                    {this.renderSquare(7, 6)}
                    {this.renderSquare(7, 7)}
                    <div className="row-label-right">1</div>
                </div>

                <div className="col-label-bottom">
                    <div>a</div>
                    <div>b</div>
                    <div>c</div>
                    <div>d</div>
                    <div>e</div>
                    <div>f</div>
                    <div>g</div>
                    <div>h</div>
                </div>

            </div>
        );
    }
}

let TurnTracker = (props) => {
    return(
        <div style={{color: props.value}} id="Turn-tracker">
            {props.value}'s turn
        </div>
    );
}

let Check = (props) => {
    return(
        <div>
            {props.value ? 
                <p style={{color:"red"}} id="check">check</p>
            :
                <div/>
            }
        </div>
    );
}

let Undo = (props) => {
    return(
        <div id="undo">
            <button onClick={props.handleUndo}>
                Undo
            </button>
        </div>
    );
}

let NewGame = () => {
    return(
        <div id="New-Game">
            <button onClick={() => window.location.reload()}>
                New Game
            </button>
        </div>
    );
}

class App  extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            board: JSON.parse(JSON.stringify(pieces)), //board is an array of the "pieces" object. See ./initialBoard for object properties. Using JSON parse and stringify to deep clone the array "pieces"
            selected_piece: { i : "", j : "", value : "", validCoordinates: [] }, // valid coordinates stores all the locations of the valid moves for the piece selected
            squareColor: default_squareColor, // squareColor is the 2D array of square colors for the puzzle that is passed every render cycle to the children
            turn: "white",
            history: [JSON.parse(JSON.stringify(pieces))], // array to store all the history of moves. Used for the undo button
            in_check: [false], // array to store the history of in-check warnings so that undo can function accurately
            can_white_castle: [true], // storing the state of whether or not the white player can castle. in an array for ease and accuracy of undo
            can_black_castle: [true] // storing the state of whether or not the white player can castle. in an array for ease and accuracy of undo
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleUndoClick = this.handleUndoClick.bind(this);
    }

    handleClick(i, j){
        //an object with info about the box we just clicked
        let clicked_piece = this.state.board[i][j];
 
        // analyze whether we're trying to move our piece to a blank square, trying to capture, in check, etc..
        startAnalysis(this, i, j, clicked_piece, this.state, default_squareColor);
    }
    
    handleUndoClick(){
        // ugly - return state back to what it was
        this.setState( (prevState) => ({
            board: prevState.history.length > 1 ? prevState.history.slice(0, prevState.history.length - 1).pop() : prevState.history[0], // not the smartest way
            history: prevState.history.length > 1 ? prevState.history.slice(0, prevState.history.length - 1) : prevState.history.slice(), // not the smartest way
            turn: prevState.history.length === 1 ? "white" :  prevState.turn === "black" ? "white" : "black", // not the smartest way
            squareColor: default_squareColor,
            selected_piece: { i : "", j : "", value : "", validCoordinates: [] },
            in_check: prevState.in_check.slice(0, prevState.in_check.length - 1),
            can_white_castle: prevState.can_white_castle.slice(0, prevState.can_white_castle.length - 1),
            can_black_castle: prevState.can_black_castle.slice(0, prevState.can_black_castle.length - 1)
        }));
    }

    render(){
        return(
            <div>
                <div id="github-logo-wrapper">
                    <a title="GitHub Repository" href="https://github.com/MohamedElassar/chess" target="_blank" rel="noreferrer">
                    <img className="github-logo" src="https://image.flaticon.com/icons/svg/25/25231.svg" alt="Github logo" />
                    </a>
                </div>
                <div id="board-wrapper">
                    <TurnTracker value={this.state.turn} />
                    <Check value={this.state.in_check[this.state.in_check.length - 1]}></Check> 
                    <ChessBoard pieces={this.state.board} squareColor={this.state.squareColor} handleClick={(i, j) => this.handleClick(i, j)} />
                    <div id="bottom-buttons">
                        <Undo handleUndo={() => this.handleUndoClick()}/>
                        <NewGame></NewGame>    
                    </div>  
                </div>
            </div>
        );
    }   
}

ReactDOM.render(<App />, document.getElementById("root"));
