import {Piece, Move} from './initialBoard'; // importing the interfaces from the initalBoard file which defines each piece object
import {State} from './startAnalysis';
import {willMovingHereCheckMe} from './check';
/****************************************************************************************************/
// function called once to initalize the chess board to the brown colors, and called to set the global variable "default_squareColor"
export function getColor(i : number, j : number) : string  {
    if(i%2 === 0){
        if(j%2 === 0){
            return "rgb(243, 218, 176)"
        } else {
            return "rgb(188, 136, 91)"
        }
    } else {
        if(j%2 === 0){
            return "rgb(188, 136, 91)"
        } else {
            return "rgb(243, 218, 176)"
        }
    }
}

/****************************************************************************************************/
export function findTheHighlightedSquares(state:State, board_copy:Array<Array<Piece>>, clicked_piece : Piece, temp_squareColor: Array<Array<string>>, i:number, j:number) : Array<Move> {
    
    let moves; // variable used to store the set of valid moves for the piece we clicked. These moves are stored in the Piece object (see initlaBoard)
    
    let validCoordinates: Array<Move> = [];

    // We have to consider Pawns separately because their valid moves change depending on if it's the first time the pawn is moved
    if(clicked_piece.piece === "Pawn"){

        validCoordinates = highlightPawn(state, board_copy, state.history, temp_squareColor, i, j, clicked_piece); // function to alter the temp_squareColor array that will be used in setState => passed and changed by reference
        // an array of valid squares that we're allowed to move to is returned. this will be returned to startAnalysis to update the state's selection_piece.validCoordinates
        return JSON.parse(JSON.stringify(validCoordinates));
    
    } else if (clicked_piece.piece === "Bishop" || clicked_piece.piece === "Rook" || clicked_piece.piece === "Queen"){

        moves = clicked_piece.move;
        validCoordinates = highlightDynamic(state, board_copy, temp_squareColor, i, j, moves as Move[]);
        return JSON.parse(JSON.stringify(validCoordinates));
    
    } else if (clicked_piece.piece === "Knight" || clicked_piece.piece === "King"){

        moves = clicked_piece.move;
        validCoordinates = highlightFixed(state, board_copy, temp_squareColor, i, j, moves as Move[]);
        return JSON.parse(JSON.stringify(validCoordinates));
    
    } else {
        return [];
    }
    
}

/****************************************************************************************************/
// function to find the spots to highlight on the puzzle for pieces with a fixed pattern of movement i.e. no diagonals / no moves that extend to either end of the puzzle
// applies to Knight and King BUT Knights are the only puzzle piece that can skip over other pieces
function highlightFixed(state:State, board_copy: Array<Array<Piece>>, temp_squareColor: Array<Array<string>>, i:number, j:number, moves:Move[]) : Array<Move> {    
        
    let move_x:number;
    let move_y:number;
    let valid_moves: Array<Move> = [];

    for(let temp = 0; temp < moves.length; temp++){ // looping through the sets of valid moves (many per piece) and changing the color of those locations in the color array to pink
        
        move_x = i + moves[temp].x ; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
        move_y = j + moves[temp].y;
        
        if(move_x < 8 && move_x >= 0 && move_y < 8 && move_y >= 0){ // check to ensure that we don't get a "index out of bound" error 
            
            if(board_copy[move_x][move_y].piece === "" || board_copy[move_x][move_y].color !== board_copy[i][j].color){ // check to only highlight the pieces that are not occupied by pieces of the same color
                

                if( !willMovingHereCheckMe(state, board_copy, move_x, move_y, i, j) ){
                    
                    temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)                    
                    // if we find a valid square that we can potentially move to, we'll add it valid_moves which will be used to update the state's "selected_piece{validCoordinates}"
                    // this validCoordinates will be used as the comparison point if our next click is on an empty square. That square's (x,y) will be compared to the coordinates in validCoordinates
                    valid_moves.push({ x: move_x, y: move_y });

                }

            } 
        }
    }

    checkForCastling(state, board_copy, i, j, temp_squareColor, valid_moves);

    return valid_moves;

}

/****************************************************************************************************/
/* this function checks if we can castle. Castling can be done when:
a) it's the king and the involved rook's first time moving
b) squares between rook and king are empty
c) king is not currently in check
d) moving the king through the squares between the king and the rook won't put the king in check, even if the king doesn't land on a threatened square
*/
function checkForCastling(state:State, board_copy:Array<Array<Piece>>, i:number, j:number, temp_squareColor:Array<Array<string>>, valid_moves:Array<Move>){
    // getting the relevant state variable tracking whether or not we can even castle in the first place
    let can_castle = board_copy[i][j].color === "white" ? state.can_white_castle[state.can_white_castle.length - 1]: state.can_black_castle[state.can_black_castle.length - 1]; 
    // if we haven't castled before, clicked on our king who hasn't moved before, and we're not currently in check, we can start analyzing 
    if(can_castle && board_copy[i][j].piece === "King" && board_copy[i][j].moved_before === false && state.in_check[state.in_check.length - 1] === false) {
        // checking if the piece in the right corner is a rook who hasn't moved before
        if(board_copy[i][7].piece === "Rook" && board_copy[i][7].moved_before === false){
            for(let index = j+1; index < 7 ; index++){ // starting with the square to the right of the king and looping through all the sqauares to the right until (excluding) the edge
                if(board_copy[i][index].piece === ""){ // checking if the square between the rook and the king is empty
                    if(!willMovingHereCheckMe(state, board_copy, i, index, i, j)){ // checking if moving my king to one of these squares won't put my king in check
                        if(index === 6){ // if we reached the last square, that means that we passed all the previous squares successfully and we can now highlight the castling square
                            temp_squareColor[i][index] = "red";
                            valid_moves.push({x:i, y:index});
                        }
                    } else {
                        break; // moving to the square would put us in check: can't castle
                    }
                } else { // we came across a square between the king and rook that isn't blank: we can't castle
                    break;
                }
            }
        }
        // this checks for the same but with the rook in the left corner
        if(board_copy[i][0].piece === "Rook" && board_copy[i][0].moved_before === false){
            for(let index = j-1; index > 0 ; index--){
                if(board_copy[i][index].piece === ""){
                    if(!willMovingHereCheckMe(state, board_copy, i, index, i, j)){
                        if(index === 1){
                            temp_squareColor[i][index + 1] = "red";
                            valid_moves.push({x:i, y:index + 1});
                        }
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

    }
}


/****************************************************************************************************/
// function to find the spots to highlight on the puzzle for pieces with a fixed pattern of movement i.e. no diagonals / no moves that extend to either end of the puzzle
// applies to Pawn, Knight, King BUT Knights are the only puzzle piece that can skip over other pieces
function highlightPawn(state:State, board_copy: Array<Array<Piece>> , history : Array<Array<Array<Piece>>> , temp_squareColor: Array<Array<string>>, i:number, j:number, clicked_piece:Piece) : Array<Move> {    

    let move_x:number;
    let move_y:number;
    let valid_moves: Array<Move> = [];
    let moves:Array<Move> = [];

    let moved_before:boolean = clicked_piece.moved_before as boolean;

    if(moved_before === false){

        moves = clicked_piece.move_Pawn_firstTime as Array<Move>;

        // this loop handles the highlighting of the 2 squares the pawn can move up initially. notice index < 2
        for(let index = 0; index < 2; index++){

            move_x = i + moves[index].x; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
            move_y = j + moves[index].y;

            if(board_copy[move_x][move_y].piece === ""){

                if( !willMovingHereCheckMe(state, board_copy, move_x, move_y, i, j) ){

                    temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)                    
                    // if we find a valid square that we can potentially move to, we'll add it valid_moves which will be used to update the state's "selected_piece{validCoordinates}"
                    // this validCoordinates will be used as the comparison point if our next click is on an empty square. That square's (x,y) will be compared to the coordinates in validCoordinates
                    valid_moves.push({ x: move_x, y: move_y });

                }

            } else {

                break;
            
            }

        }

        // this loop starts at 2 because the elements in the move_pawn_first_time array have this arrangement:
        // [0] and [1] are for the 2 vertical squares that the pawn can move up if free, [2] and [3] are the diagonal captures a pawn can make even on its first move
        for(let index = 2; index < moves.length; index++){

            move_x = i + moves[index].x; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
            move_y = j + moves[index].y;

            if(move_x < 8 && move_x >= 0 && move_y < 8 && move_y >= 0){

                if(board_copy[move_x][move_y].piece !== "" && board_copy[move_x][move_y].color !== board_copy[i][j].color){

                    if( !willMovingHereCheckMe(state, board_copy, move_x, move_y, i, j) ){

                        temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)                    
                        // if we find a valid square that we can potentially move to, we'll add it valid_moves which will be used to update the state's "selected_piece{validCoordinates}"
                        // this validCoordinates will be used as the comparison point if our next click is on an empty square. That square's (x,y) will be compared to the coordinates in validCoordinates
                        valid_moves.push({ x: move_x, y: move_y });

                    }

                } 
            }

        }

    } else {

        // handling the ability to move up one square if free
        moves = clicked_piece.move as Array<Move>;

        move_x = i + moves[0].x; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
        move_y = j + moves[0].y;

        if(board_copy[move_x][move_y].piece === ""){

            if( !willMovingHereCheckMe(state, board_copy, move_x, move_y, i, j) ){

                temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)                    
                    // if we find a valid square that we can potentially move to, we'll add it valid_moves which will be used to update the state's "selected_piece{validCoordinates}"
                    // this validCoordinates will be used as the comparison point if our next click is on an empty square. That square's (x,y) will be compared to the coordinates in validCoordinates
                    valid_moves.push({ x: move_x, y: move_y });

                }

        }

        // checking if we can highlight the corner squares if there's potential for capturing
        for(let index = 1; index < moves.length; index++){

            move_x = i + moves[index].x; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
            move_y = j + moves[index].y;

            if(move_x < 8 && move_x >= 0 && move_y < 8 && move_y >= 0){    

                if(board_copy[move_x][move_y].piece !== "" && board_copy[move_x][move_y].color !== board_copy[i][j].color){

                    if( !willMovingHereCheckMe(state, board_copy, move_x, move_y, i, j) ){

                        temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)                    
                        // if we find a valid square that we can potentially move to, we'll add it valid_moves which will be used to update the state's "selected_piece{validCoordinates}"
                        // this validCoordinates will be used as the comparison point if our next click is on an empty square. That square's (x,y) will be compared to the coordinates in validCoordinates
                        valid_moves.push({ x: move_x, y: move_y });

                    }
                }

            }
        }

        // handling the En Passant rule for pawns - TBD stupid method

        let pawn_color = clicked_piece.color;

        if(pawn_color === "white"){

            if(j-1 >= 0){ // checking if the square immediately to our left is a pawn of the opposite color
                if(board_copy[i][j-1].piece === "Pawn" && board_copy[i][j-1].color !== board_copy[i][j].color){
                    let previous_board = history[history.length - 2];
                    let previous_opponent_location = previous_board[i][j-1];
                    if(previous_opponent_location.piece === "" && previous_board[i-2][j-1].piece === "Pawn" && previous_board[i-2][j-1].moved_before === false){
                        
                        if( !willMovingHereCheckMe(state, board_copy, move_x, move_y, i, j) ){

                            temp_squareColor[i-1][j-1] = "pink";                    
                            valid_moves.push({ x: i-1, y: j-1 });

                        }
                    }
                }
            } 
            
            if(j+1 < board_copy.length){ // checking if the square immediately to our right is a pawn of the opposite color
                if(board_copy[i][j+1].piece === "Pawn" && board_copy[i][j+1].color !== board_copy[i][j].color){
                    let previous_board = history[history.length - 2];
                    let previous_opponent_location = previous_board[i][j+1];
                    if(previous_opponent_location.piece === "" && previous_board[i-2][j+1].piece === "Pawn" && previous_board[i-2][j+1].moved_before === false){
                        
                        if( !willMovingHereCheckMe(state, board_copy, move_x, move_y, i, j) ){

                            temp_squareColor[i-1][j+1] = "pink";                    
                            valid_moves.push({ x: i-1, y: j+1 });

                        }
                    }
                }
            }

        } else if(pawn_color === "black"){
            if(j-1 >= 0){
                if(board_copy[i][j-1].piece === "Pawn" && board_copy[i][j-1].color !== board_copy[i][j].color){
                    let previous_board = history[history.length - 2];
                    let previous_opponent_location = previous_board[i][j-1];
                    if(previous_opponent_location.piece === "" && previous_board[i+2][j-1].piece === "Pawn" && previous_board[i+2][j-1].moved_before === false){
                        
                        if( !willMovingHereCheckMe(state, board_copy, move_x, move_y, i, j) ){

                            temp_squareColor[i+1][j-1] = "pink";                    
                            valid_moves.push({ x: i+1, y: j-1 });

                        }
                    }
                }
            } 
            
            if(j+1 < board_copy.length){
                if(board_copy[i][j+1].piece === "Pawn" && board_copy[i][j+1].color !== board_copy[i][j].color){
                    let previous_board = history[history.length - 2];
                    let previous_opponent_location = previous_board[i][j+1];
                    if(previous_opponent_location.piece === "" && previous_board[i+2][j+1].piece === "Pawn" && previous_board[i+2][j+1].moved_before === false){
                        
                        if( !willMovingHereCheckMe(state, board_copy, move_x, move_y, i, j) ){

                            temp_squareColor[i+1][j+1] = "pink";                    
                            valid_moves.push(
                                {
                                x: i+1, 
                                y: j+1 
                                });
                        }
                    }
                }
            }
        }


    }

    return valid_moves;

}

/****************************************************************************************************/
// function to find the spots to highlight on the puzzle for pieces with a dynamic pattern of movement i.e. diagonals, moves that extend to either end of the puzzle
// applies to Bishops, Queens, Rooks
// NOTE: these pieces CANNOT skip over pieces in their proposed path 
function highlightDynamic(state:State, board_copy: Array<Array<Piece>>, temp_squareColor: Array<Array<string>>, i:number, j:number, moves:Move[]) : Array<Move>{    

    let move_x:number;
    let move_y:number;
    let valid_moves: Array<Move> = [];

    for(let temp = 0; temp < moves.length; temp++){ // looping through the sets of valid moves (many per piece) and changing the color of those locations in the color array to pink
        
        for (let count = 1; count < 8; count++){ // I have to loop through multiple possibilites for each given move; this is to catch the diagonal aspect. e.g. if 1, 1 is a possible move, I need to also check if 2,2 and 3,3, etc. are valid diagonal moves
            
            move_x = i + count * moves[temp].x ; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
            move_y = j + count * moves[temp].y;
            
            if(move_x < 8 && move_x >= 0 && move_y < 8 && move_y >= 0){ // check to ensure that we don't get a "index out of bound" error
                
                if(board_copy[move_x][move_y].piece === ""){  // highlighting an empty square in the piece's proposed path
                    
                    if( !willMovingHereCheckMe(state, board_copy, move_x, move_y, i, j) ){

                        temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)
                        valid_moves.push({ x: move_x, y: move_y });
                    
                    }

                } else if (board_copy[move_x][move_y].color !== board_copy[i][j].color) { // highlighting a non-empty square that must be of the opposite color. This shows that we can capture this piece
                
                    if( !willMovingHereCheckMe(state, board_copy, move_x, move_y, i, j) ){

                        temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)
                        valid_moves.push({ x: move_x, y: move_y });

                    }

                    break;// breaking because we can't skip over the enemy piece that we found on our path

                } else {

                    break; // we must've come across a piece of the same color in our path. Thus, we break and try a different pattern
                
                }
            }
        }

    }
    return valid_moves;
}

