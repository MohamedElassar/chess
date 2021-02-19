import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {getColor} from './utils';
import {pieces} from './initialBoard';

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
        let color = getColor(i, j);
        return <Square 
                    image={this.props.pieces[i][j].image}  
                    onClick={() => this.props.handleClick(i, j)} 
                    color={color}>
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

class App  extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            board: pieces, //board is an array of objects. Object.image and Object.value are the attributes we're storing
            selected_piece: { i : "", j : "", value : "" },
        }
    }

    handleClick(i, j){
        let clicked_piece = this.state.board[i][j]; //an object with info about the box we just clicked
        if(this.state.selected_piece.value == "" || clicked_piece.value != ""){
            this.setState({
                selected_piece: { i : i, j : j, value : clicked_piece.value }
            });
        } else if(clicked_piece.value == "" && this.state.selected_piece.value != "") {
            console.log("moved!");
            let board_copy = [...this.state.board];
            let temp = board_copy[i][j];
            board_copy[i][j] = board_copy[this.state.selected_piece.i][this.state.selected_piece.j];    
            board_copy[this.state.selected_piece.i][this.state.selected_piece.j] = temp;
            this.setState({
                board: [...board_copy],
                selected_piece: { i : "", j : "", value : "" }
            });
        }
    }

    render(){
        return(
            <div id="board-wrapper">
                <ChessBoard pieces={this.state.board} handleClick={(i, j) => this.handleClick(i, j)} />
            </div>
        );
    }   
}

ReactDOM.render(<App />, document.getElementById("root"));