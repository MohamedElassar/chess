import {Piece, Move} from './initialBoard'; // importing the interfaces from the initalBoard file which defines each piece object
import {findTheHighlightedSquares, makeMove} from './utils'; // function to color the right squares when we select a chess piece

export interface SelectedPiece {
    i: number | string;
    j: number | string;
    value: number | string;
    validCoordinates: Move[];
}

interface State {
    board: Array<Array<Piece>>;
    selected_piece: SelectedPiece;
    squareColor: Array<Array<string>>;
    instance: this;
    turn: string;
}

/*
function to handle 4 situations: 
1) clicking an empty box after clicking an empty box 
2) clicking on a piece after clicking an empty box 
3) clicking on an empty box after clicking on a piece
4) clicking on a piece after clicking on a piece
*/
export function startAnalysis(instance:any, i:number, j:number, clicked_piece:Piece, state:State, default_squareColor:Array<Array<string>>) {

    // the value (e.g. "Pawn", "", etc.) and location of the click before the one we're currently analyzing
    let previous_value = state.selected_piece.value;
    let previous_i = state.selected_piece.i;
    let previous_j = state.selected_piece.j;

    // color of the current turn
    let player_turn = state.turn;

    // the array [{x:5, y:4}, ..., {x:6, y:6}] holds the valid moves of the piece we previously clicked. will be used for comparison against (x,y) if we click on an empty square after clicking on a piece
    let validMoves = state.selected_piece.validCoordinates;

    //making a copy of the board to be updated
    let board_copy = JSON.parse(JSON.stringify(state.board));

    // make a copy of the default square color array (brown squares) because we're about to change it to have the valid moves highlighted
    let temp_squareColor = JSON.parse(JSON.stringify(default_squareColor));

    // just making a deep copy of the previous piece's valid locations
    let validLocationsToMoveTo = JSON.parse(JSON.stringify(validMoves));

    switch (previous_value === "") {

        case true: // if the previously selected piece was just an empty square:
            switch (clicked_piece.piece === "") {
                case true: // previous was blank + current selection is blank
                    instance.setState( (prevState:State) => ({
                        selected_piece: { i : i, j : j, value : clicked_piece.piece, validCoordinates: [] },
                        squareColor: default_squareColor
                        }));
                break;
                case false: // previous was blank + current selection is a chess piece 

                    // function to change the array temp_squareColor so that it holds all the locations of the squares to be highlighted pink
                    validLocationsToMoveTo = findTheHighlightedSquares(board_copy, clicked_piece, temp_squareColor, i, j);

                    instance.setState({
                        selected_piece: { i : i, j : j, value : clicked_piece.piece, validCoordinates: JSON.parse(JSON.stringify(validLocationsToMoveTo)) },
                        squareColor: JSON.parse(JSON.stringify(temp_squareColor)), // update the board to have highlighted pieces indicating valid moves
                        });
                break;
            }
        break;

        case false: // if the previously selected piece was an actual chess piece:
            switch (clicked_piece.piece === "") {
                case true: // previous was a piece + current selection is a blank square. If we clicked a blank square with our previous selection being a non-empty square i.e. we'll start to analyze if a move is ok
                    
                    // makeMove will analyze if the proposed move is valid and will alter the board accordingly
                    // note that I override the typescript types using the "as" keyword. This is because initally the indeces are set to "" so they can be either string or number
                    makeMove(board_copy, i, j, previous_i as number, previous_j as number, validLocationsToMoveTo, instance, default_squareColor, player_turn);

                break; 
                case false: // previous was a piece + current selection is a another piece

                    // function to change the array temp_squareColor so that it holds all the locations of the squares to be highlighted pink
                    validLocationsToMoveTo = findTheHighlightedSquares(board_copy, clicked_piece, temp_squareColor, i, j);

                    instance.setState({
                        selected_piece: { i : i, j : j, value : clicked_piece.piece, validCoordinates: JSON.parse(JSON.stringify(validLocationsToMoveTo)) },
                        squareColor: JSON.parse(JSON.stringify(temp_squareColor)), // update the board to have highlighted pieces indicating valid moves
                        });
                break;
            }
        break;
    }
}
