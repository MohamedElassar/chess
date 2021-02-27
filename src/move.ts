import {Piece, Move} from './initialBoard'; // importing the interfaces from the initalBoard file which defines each piece object
import {State} from './startAnalysis';
import {pawnPromotions} from './initialBoard';
/****************************************************************************************************/
// function to analyze if the location the user clicked is a valid move for the piece they previously clicked
export function makeMove(board_copy : Array<Array<Piece>>, i:number, j:number, previous_i: number, previous_j:number, 
    validLocationsToMoveTo: Array<Move>, instance:any, default_squareColor:Array<Array<string>>, player_turn: string){

    let isValid:boolean = isValidMove(i, j, validLocationsToMoveTo);
    
    if(isValid){
        
        // check if we're tyring to capture a pawn through en passant 
        checkForEnPassant(board_copy, i, j, previous_i, previous_j, validLocationsToMoveTo);

        // swapping the elements in the board (the current one we clicked with the previous one we clicked)
        swap(board_copy, i, j, previous_i, previous_j);
        console.log("moved!");

        // specific to pawns: after moving them for the first time, we have to set their moved_before attribute to true. This will enable us to use their second set of valid moves next time we want to move the same pawn
        if(board_copy[i][j].piece === "Pawn" && board_copy[i][j].moved_before === false){
            board_copy[i][j].moved_before = true;
        }

        // promoting a pawn that reached the end of the board
        if(board_copy[i][j].piece === "Pawn" && (i === board_copy.length - 1 || i === 0) ){
            promotePawn(board_copy, i, j, previous_i, previous_j);
        }

        // we successfully made a move. now we need to switch the turns so that the opposite color can play
        if(player_turn === "white"){
            player_turn = "black";
        } else {
            player_turn = "white";
        }

        // update the board and reset the previous selection to be nothing + update history array for undoing
        instance.setState( (prevState:State) => ({
            board: JSON.parse(JSON.stringify(board_copy)),
            selected_piece: { i : "", j : "", value : "", validCoordinates: [] }, // resetting the selection to nothing and the validcoordinates to nothing
            squareColor: JSON.parse(JSON.stringify(default_squareColor)),
            turn: player_turn, // update the color of the turn
            history: [...prevState.history, JSON.parse(JSON.stringify(board_copy))] // storing history for undo button
        }));
    }

} 

/****************************************************************************************************/
// function to check if the proposed move is valid. It compares the (x,y) of the clicked square to the valid set of squares for the previously selected pieces, which is stored in state.validCoordinates 
function isValidMove(i:number, j:number, validLocationsToMoveTo: Array<Move>) : boolean {
    for(let index = 0; index < validLocationsToMoveTo.length; index++){
        let valid_x = validLocationsToMoveTo[index].x;
        let valid_y = validLocationsToMoveTo[index].y;
        if(valid_x === i && valid_y === j){
            return true;
        }
    }
    return false;
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
// swapping the piece with the valid destination
function swap(board_copy : Array<Array<Piece>>, i:number, j:number, previous_i: number, previous_j:number){
    let temp = board_copy[i][j];
    board_copy[i][j] = board_copy[previous_i][previous_j];
    board_copy[previous_i][previous_j] = temp;
}

/****************************************************************************************************/
function promotePawn(board_copy:Array<Array<Piece>>, i:number, j:number, previous_i:number, previous_j:number){

    let options: any;
    let user_choice:string | null;

    while(true){
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
    board_copy[i][j] = options[(user_choice as string).toLocaleLowerCase()];
}