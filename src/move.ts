import {Piece, Move} from './initialBoard'; // importing the interfaces from the initalBoard file which defines each piece object
import {State} from './startAnalysis';
import {swap, promotePawn, isValidMove} from './sharedMoveLogic';
import {findEnemyKing, getAllAttackLocations} from './check';
import { findTheHighlightedSquares } from './highlighting';
/****************************************************************************************************/
// function to analyze if the location the user clicked is a valid move for the piece they previously clicked
export function makeMove(board_copy : Array<Array<Piece>>, i:number, j:number, previous_i: number, previous_j:number, 
    validLocationsToMoveTo: Array<Move>, instance:any, default_squareColor:Array<Array<string>>, player_turn: string, state:State){

    let isValid:boolean = isValidMove(i, j, validLocationsToMoveTo); // checking that the move we're trying to make is even a valid one i.e. a highlighted square which was determined to be valid
    
    if(isValid){
        
        // check if we're tyring to capture a pawn through en passant 
        checkForEnPassant(board_copy, i, j, previous_i, previous_j, validLocationsToMoveTo);

       // castling variables to update the state if we end up castling one of our pieces
       let canWhiteCastle:boolean = true;
       let canBlackCastle:boolean = true;

       // check if we tried to castle given that we previously clicked on a king and currently clicked on an empty square
       if(board_copy[previous_i][previous_j].piece === "King" && board_copy[i][j].piece === "" && board_copy[previous_i][previous_j].moved_before === false && (canBlackCastle || canWhiteCastle)){
           checkCastling(board_copy, i, j, previous_i, previous_j, validLocationsToMoveTo);
           board_copy[previous_i][previous_j].moved_before = true;
           player_turn === "white" ? canWhiteCastle = false : canBlackCastle = false;
       }

        // swapping the elements in the board (the current one we clicked with the previous one we clicked)
        swap(board_copy, i, j, previous_i, previous_j);
        console.log("moved!");

        // specific to pawns: after moving them for the first time, we have to set their moved_before attribute to true. This will enable us to use their second set of valid moves next time we want to move the same pawn
        if((board_copy[i][j].piece === "Pawn"|| board_copy[i][j].piece === "Rook") && board_copy[i][j].moved_before === false){
            board_copy[i][j].moved_before = true;
        }

        // promoting a pawn that reached the end of the board
        promotePawn(board_copy, i, j, previous_i, previous_j);

        // checking if I put them in check after my move
        let didIPutThemInCheck:boolean = didMyMovePutYouInCheck(board_copy, player_turn, state);

        // checking if theier next round won't have any valid moves: VERY INEFFICIENT
        didMyMoveCheckMateThem(board_copy, player_turn === "white" ? "black" : "white", state)

        // we successfully made a move. now we need to switch the turns so that the opposite color can play
        player_turn === "white" ? player_turn = "black" : player_turn = "white";
        
        // update the board and reset the previous selection to be nothing + update history array for undoing
        instance.setState( (prevState:State) => ({
            board: JSON.parse(JSON.stringify(board_copy)),
            selected_piece: { i : "", j : "", value : "", validCoordinates: [] }, // resetting the selection to nothing and the validcoordinates to nothing
            squareColor: JSON.parse(JSON.stringify(default_squareColor)),
            turn: player_turn, // update the color of the turn
            history: [...prevState.history, JSON.parse(JSON.stringify(board_copy))], // storing history for undo button
            in_check: [...prevState.in_check, didIPutThemInCheck], // appending the state of check for the undo button
            can_white_castle: [...prevState.can_white_castle, canWhiteCastle],
            can_black_castle: [...prevState.can_black_castle, canBlackCastle]
        }));
        
    }

} 

/****************************************************************************************************/
function checkForEnPassant(board_copy:Array<Array<Piece>>, i:number, j:number, previous_i:number, previous_j:number, validLocationsToMoveTo:Array<Move>){

    // check if the piece we're trying to move is a Pawn and that we're trying to move it to an empty square
    if(board_copy[previous_i][previous_j].piece === "Pawn" && board_copy[i][j].piece === ""){

        if(board_copy[previous_i][previous_j].color === "white"){
            if(j !== previous_j){ // i.e. we're trying to move a pawn diagonally to a non-empty square
                board_copy[i+1][j] = {image: "", piece: "", color: "", move : []}; // capture the opponent's pawn below us
            }

        } else {
            if(j !== previous_j){
                board_copy[i-1][j] = {image: "", piece: "", color: "", move : []};
            }
        }
        
    }
}
/****************************************************************************************************/
function checkCastling(board_copy:Array<Array<Piece>>, i:number, j:number, previous_i:number, previous_j:number, validLocationsToMoveTo:Array<Move>){
    if(j - previous_j === 2){ // swapping with the rook to the right
        swap(board_copy, i, j-1, i, 7);
    } else if (previous_j - j === 2){ // swapping with the rook to the left
        swap(board_copy, i, j+1, i, 0);
    }
}
/****************************************************************************************************/
function didMyMovePutYouInCheck(board_copy:Array<Array<Piece>>, player_turn:string, state:State){
    
    let [enemyKing_x, enemyKing_y] = findEnemyKing(board_copy, player_turn) // find the enemy's king

    let copy_1 = JSON.parse(JSON.stringify(board_copy));
    let copy_2 = JSON.parse(JSON.stringify(board_copy));

    // this function will return all the possible locations that I can capture as of the current board state (including my last move)
    // notice that I'm passing the opposite color to the turn. This is because of how I wrote that function in ./check
    let allMyNextPossibleMoves = getAllAttackLocations(state, copy_1, copy_2, player_turn === "white" ? "black" : "white");
    
    // as of the current board state, is the opponent's king under check?
    for(let index = 0; index < allMyNextPossibleMoves.length; index++){
        for(let indexx = 0 ; indexx < allMyNextPossibleMoves[index].length ; indexx++){
            let x = allMyNextPossibleMoves[index][indexx].x;
            let y = allMyNextPossibleMoves[index][indexx].y;
            if(x === enemyKing_x && y === enemyKing_y){
                return true;
            }
        }
    }

    return false;

}
/****************************************************************************************************/
function didMyMoveCheckMateThem(board_copy:Array<Array<Piece>>, player_turn:string, state:State){

    let enemyPossibleCaptureLocations: Move[][] = [];
    let colorrr:Array<Array<string>> = Array(8).fill("").map((value, index) => Array(8).fill("")); // not good

    for(let i = 0 ; i < board_copy.length ; i++){
        for (let j = 0; j < board_copy.length; j++) {
            if(board_copy[i][j].color !== player_turn){
                enemyPossibleCaptureLocations.push(findTheHighlightedSquares(state, board_copy, board_copy[i][j], colorrr, i, j));
            }
        }
    }

    let flag = true;

    for(let i = 0 ; i < enemyPossibleCaptureLocations.length ; i++){
        let inspect = enemyPossibleCaptureLocations[i].length;
        if(inspect !== 0) {flag = false; break;} else {} ;
    }

    // check if my opponent can't make any possible moves i.e. I won!
    if(flag){
        if( window.confirm(player_turn.concat(" won! Play again?")) ){
            window.location.reload();
        } else {

        }
    }

}