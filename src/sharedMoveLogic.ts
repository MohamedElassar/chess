import {pawnPromotions} from './initialBoard';
import {Piece, Move} from './initialBoard'; // importing the interfaces from the initalBoard file which defines each piece object
/****************************************************************************************************/
// swapping the piece with the valid destination
export function swap(board_copy : Array<Array<Piece>>, i:number, j:number, previous_i: number, previous_j:number){
    
    let temp = board_copy[i][j];

    if(temp.piece === ""){ // just moving a piece to a valid empty square
        board_copy[i][j] = board_copy[previous_i][previous_j];
        board_copy[previous_i][previous_j] = temp;
    } else { // capturing a piece
        board_copy[i][j] = board_copy[previous_i][previous_j];
        board_copy[previous_i][previous_j] = {image: "", piece: "", color: "", move:[]}; // swap locations and turn the opposing piece to just an empty square
    }

}

/****************************************************************************************************/
// this function handles the promotion of the pawn when we try to move it to an empty square at the top or bottom edge of the board
export function promotePawn(board_copy:Array<Array<Piece>>, i:number, j:number, previous_i:number, previous_j:number){

    if(board_copy[i][j].piece === "Pawn" && (i === board_copy.length - 1 || i === 0) ){

        let options: any; // will store an object of objects (see pawnpromotions in ./initialboard.ts)
        let user_choice:string | null;
    
        while(true){
            // when we move the pawn to an empty square at the edge, we prompt the user to type in the piece they want the pawn to be promoted to
            user_choice = window.prompt("What would you like the pawn to be promoted to?\nChoose from a bishop, queen, rook, or knight.")
            user_choice = (user_choice as string).toLocaleLowerCase()
            if(user_choice === "rook" || user_choice === "queen" || user_choice === "knight" || user_choice === "bishop"){
                break;
            }
        }
    
        if(board_copy[i][j].color === "white"){
            options = pawnPromotions.white;
        } else {
            options = pawnPromotions.black;
        }
   
        // switching out the pawn with the piece we selected.
        board_copy[i][j] = options[user_choice as string];    
   
    }

}
/****************************************************************************************************/
// function to check if the proposed move is valid. It compares the (x,y) of the clicked square to the valid set of squares for the previously selected pieces, which is stored in state.validCoordinates 
export function isValidMove(i:number, j:number, validLocationsToMoveTo: Array<Move>) : boolean {
    for(let index = 0; index < validLocationsToMoveTo.length; index++){
        let valid_x = validLocationsToMoveTo[index].x;
        let valid_y = validLocationsToMoveTo[index].y;
        if(valid_x === i && valid_y === j){
            return true;
        }
    }
    return false;
}