import {Piece, Move} from './initialBoard'; // importing the interfaces from the initalBoard file which defines each piece object
import {findTheHighlightedSquares, makeMove} from './utils'; // function to color the right squares when we select a chess piece

export interface SelectedPiece {
    i: number | string;
    j: number | string;
    value: number | string;
}

interface State {
    board: Array<Array<Piece>>;
    selected_piece: SelectedPiece;
    squareColor: Array<Array<string>>;
    instance: this;
}

export function startAnalysis(instance:any, i:number, j:number, clicked_piece:Piece, state:State, default_squareColor:Array<Array<string>>) {

    let previous_value = state.selected_piece.value;
    let previous_i = state.selected_piece.i;
    let previous_j = state.selected_piece.j;

    switch (previous_value === "") {

        case true: // if the previously selected piece was just an empty square:
            switch (clicked_piece.piece === "") {
                case true: // previous was blank + current selection is blank
                    instance.setState( (prevState:State) => ({
                        selected_piece: { i : i, j : j, value : clicked_piece.piece },
                        squareColor: default_squareColor
                        }));
                break;
                case false: 
                    // previous was blank + current selection is a chess piece make a copy of the default square color array (brown squares)
                    let temp_squareColor = JSON.parse(JSON.stringify(default_squareColor));
                    
                    // function to change the array temp_squareColor so that it holds all the locations of the squares to be highlighted pink
                    findTheHighlightedSquares(clicked_piece, temp_squareColor, i, j);

                    instance.setState({
                        selected_piece: { i : i, j : j, value : clicked_piece.piece },
                        squareColor: temp_squareColor // update the board to have highlighted pieces indicating valid moves
                        });
                break;
            }
        break;

        case false: // if the previously selected piece was an actual chess piece:
            switch (clicked_piece.piece === "") {
                case true: // previous was a piece + current selection is a blank square if we clicked a blank square with our previous selection being a non-empty square i.e. we'll start to analyze if a move is ok

                    //making a copy of the board to be updated
                    let board_copy = JSON.parse(JSON.stringify(state.board));
                    
                    // swapping the elements in the board (the current one we clicked with the previous one we clicked). function is in ./utils.ts
                    // note that I override the typescript types using the "as" keyword. This is because initally the indeces are set to "" so they can be either string or number
                    makeMove(board_copy, i, j, previous_i as number, previous_j as number, instance, default_squareColor);

                break;
                case false: // previous was a piece + current selection is a another piece
                    let temp_squareColor = default_squareColor.map((value) => value.slice());

                    findTheHighlightedSquares(clicked_piece, temp_squareColor, i, j);

                    instance.setState({
                        selected_piece: { i : i, j : j, value : clicked_piece.piece },
                        squareColor: temp_squareColor
                        });
                break;
            }
        break;
    }
}
