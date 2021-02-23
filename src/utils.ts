import {Piece, Move} from './initialBoard'; // importing the interfaces from the initalBoard file which defines each piece object

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

export function findTheHighlightedSquares(board_copy:Array<Array<Piece>>, clicked_piece : Piece, temp_squareColor: Array<Array<string>>, i:number, j:number) : Array<Move> {
    
    let moves; // variable used to store the set of valid moves for the piece we clicked. These moves are stored in the Piece object (see initlaBoard)
    
    let validCoordinates: Array<Move> = [];

    // We have to consider Pawns separately because their valid moves change depending on if it's the first time the pawn is moved
    if(clicked_piece.piece === "Pawn"){
    
        if(clicked_piece.moved_before === false){ // it's the first time moving this pawn
            moves = clicked_piece.move_Pawn_firstTime; // use the set of valid moves that are specific to the pawn's first move
        } else {
            moves = clicked_piece.move; // pawn has been moved before; use the set of moves specific to that case
        }
    
        validCoordinates = highlightFixed(board_copy, temp_squareColor, i, j, moves as Move[]); // function to alter the temp_squareColor array that will be used in setState => passed and changed by reference
        // an array of valid squares that we're allowed to move to is returned. this will be returned to startAnalysis to update the state's selection_piece.validCoordinates

        return JSON.parse(JSON.stringify(validCoordinates));
    
    } else if (clicked_piece.piece === "Bishop" || clicked_piece.piece === "Rook" || clicked_piece.piece === "Queen"){

        moves = clicked_piece.move;
        validCoordinates = highlightDynamic(board_copy, temp_squareColor, i, j, moves as Move[]);
        return validCoordinates;
    
    } else if (clicked_piece.piece === "Knight" || clicked_piece.piece === "King"){

        moves = clicked_piece.move;
        validCoordinates = highlightFixed(board_copy, temp_squareColor, i, j, moves as Move[]);
        return JSON.parse(JSON.stringify(validCoordinates));
    
    } else {
        return [];
    }
    
}

/****************************************************************************************************/
// function to find the spots to highlight on the puzzle for pieces with a fixed pattern of movement i.e. no diagonals / no moves that extend to either end of the puzzle
// applies to Pawn, Knight, King BUT Knights are the only puzzle piece that can skip over other pieces
function highlightFixed(board_copy: Array<Array<Piece>> , temp_squareColor: Array<Array<string>>, i:number, j:number, moves:Move[]) : Array<Move> {    
    if (moves != undefined){ // to be removed: just here for now because I haven't defined the valid moves for all the different pieces, so it could be undefined for anything but a pawn 
        
        let move_x:number;
        let move_y:number;
        let valid_moves: Array<Move> = [];

        for(let temp = 0; temp < moves.length; temp++){ // looping through the sets of valid moves (many per piece) and changing the color of those locations in the color array to pink
            move_x = i + moves[temp].x ; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
            move_y = j + moves[temp].y;
            if(move_x < 8 && move_x >= 0 && move_y < 8 && move_y >= 0){ // check to ensure that we don't get a "index out of bound" error 
                
                if(board_copy[move_x][move_y].piece == "" || board_copy[move_x][move_y].color != board_copy[i][j].color){ // check to only highlight the pieces that are not occupied by pieces of the same color
                    
                    temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)                    
                    // if we find a valid square that we can potentially move to, we'll add it valid_moves which will be used to update the state's "selected_piece{validCoordinates}"
                    // this validCoordinates will be used as the comparison point if our next click is on an empty square. That square's (x,y) will be compared to the coordinates in validCoordinates
                    valid_moves.push(
                        {
                        x: move_x, 
                        y: move_y 
                        });
                //ddd
                } else {
                    
                    if(board_copy[i][j].piece === "Pawn"){ // if this is true, this means my pawn (which hasn't moved before) has another piece infront of it and so can't skip it
                        break; // otherwise, if my first move is a knight to a square right infront of a pawn, and i want to move that pawn next, I would highlight the square two rows up. Pawns shouldn't be able to skip other pieces
                    }

                }

            }
        }

        return valid_moves;
    
    } else {
        return []; //to be removed: just here to avoid error of no return
    }    

}

/****************************************************************************************************/
// function to find the spots to highlight on the puzzle for pieces with a dynamic pattern of movement i.e. diagonals, moves that extend to either end of the puzzle
// applies to Bishops, Queens, Rooks
// NOTE: these pieces CANNOT skip over pieces in their proposed path 
function highlightDynamic(board_copy: Array<Array<Piece>>, temp_squareColor: Array<Array<string>>, i:number, j:number, moves:Move[]) : Array<Move>{    
    if (moves != undefined){ // to be removed: just here for now because I haven't defined the valid moves for all the different pieces, so it could be undefined for anything but a pawn 

        let move_x:number;
        let move_y:number;
        let valid_moves: Array<Move> = [];

        for(let temp = 0; temp < moves.length; temp++){ // looping through the sets of valid moves (many per piece) and changing the color of those locations in the color array to pink
            
            for (let count = 1; count < 8; count++){ // I have to loop through multiple possibilites for each given move; this is to catch the diagonal aspect. e.g. if 1, 1 is a possible move, I need to also check if 2,2 and 3,3, etc. are valid diagonal moves
                
                move_x = i + count * moves[temp].x ; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
                move_y = j + count * moves[temp].y;
                
                if(move_x < 8 && move_x >= 0 && move_y < 8 && move_y >= 0){ // check to ensure that we don't get a "index out of bound" error
                    
                    if(board_copy[move_x][move_y].piece == ""){  // highlighting an empty square in the piece's proposed path
                        temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)
                        valid_moves.push(
                            {
                            x: move_x, 
                            y: move_y 
                            });
                        
                    } else if (board_copy[move_x][move_y].color != board_copy[i][j].color) { // highlighting a non-empty square that must be of the opposite color. This shows that we can capture this piece
                    
                        temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)
                        valid_moves.push(
                            {
                            x: move_x, 
                            y: move_y 
                            });
                        break; // breaking because we can't skip over the enemy piece that we found on our path
                    
                    } else {
                        break; // we must've come across a piece of the same color in our path. Thus, we break and try a different pattern
                    }
                }
            }

        }
        return valid_moves;

    } else {
        return []; //to be removed: just here to avoid error of no return
    }    

}

/****************************************************************************************************/
// function to analyze if the location the user clicked is a valid move for the piece they previously clicked
export function makeMove(board_copy : Array<Array<Piece>>, i:number, j:number, previous_i: number, previous_j:number, 
    validLocationsToMoveTo: Array<Move>, instance:any, default_squareColor:Array<Array<string>>, player_turn: string){

    let isValid:boolean = isValidMove(i, j, validLocationsToMoveTo);
    
    if(isValid){
        // swapping the elements in the board (the current one we clicked with the previous one we clicked)
        swap(board_copy, i, j, previous_i, previous_j);
        console.log("moved!");

        // specific to pawns: after moving them for the first time, we have to set their moved_before attribute to true. This will enable us to use their second set of valid moves next time we want to move the same pawn
        if(board_copy[i][j].piece === "Pawn" && board_copy[i][j].moved_before === false){
            board_copy[i][j].moved_before = true;
        }

        // we successfully made a move. now we need to switch the turns so that the opposite color can play
        if(player_turn === "light"){
            player_turn = "dark";
        } else {
            player_turn = "light";
        }

        // update the board and reset the previous selection to be nothing
        instance.setState( () => ({
            board: JSON.parse(JSON.stringify(board_copy)),
            selected_piece: { i : "", j : "", value : "", validCoordinates: [] }, // resetting the selection to nothing and the validcoordinates to nothing
            squareColor: JSON.parse(JSON.stringify(default_squareColor)),
            turn: player_turn // update the color of the turn
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
// swapping the piece with the valid destination
function swap(board_copy : Array<Array<Piece>>, i:number, j:number, previous_i: number, previous_j:number){
    let temp = board_copy[i][j];
    board_copy[i][j] = board_copy[previous_i][previous_j];
    board_copy[previous_i][previous_j] = temp;
}

// /****************************************************************************************************/
// // checking if move is valid by comparing the indeces of the destination square to all the valid indeces.
// function isValidMoveFixed(valid_moves:Move[], previous_i:number, previous_j:number, i:number, j:number) : boolean {
//     // looping through all valid moves for each piece
//     for(let index = 0; index < valid_moves.length ; index++){
//         // finding the valid indeces by applying the transformations specific to each piece's valid moves
//         let potential_move_x = previous_i + valid_moves[index].x;
//         let potential_move_y = previous_j + valid_moves[index].y;
//         // comparing the indeces of the clicked location to the results of the piece's valid move transformations
//         if(i === potential_move_x && j === potential_move_y){
//             return true;
//         }
//     }
//     return false;  
// }


// /****************************************************************************************************/
// // checking if move is valid by comparing the indeces of the destination square to all the valid indeces.
// function isValidMoveDynamic(valid_moves:Move[], previous_i:number, previous_j:number, i:number, j:number) : boolean {
//     // looping through all valid moves for each piece
//     for(let index = 0; index < valid_moves.length ; index++){

//         for (let count = 1; count < 8; count++){
//             // finding the valid indeces by applying the transformations specific to each piece's valid moves
//             let potential_move_x = previous_i + count * valid_moves[index].x;
//             let potential_move_y = previous_j + count * valid_moves[index].y;
//             // comparing the indeces of the clicked location to the results of the piece's valid move transformations
//             if(i === potential_move_x && j === potential_move_y){
//                 return true;
//             }
//         }
        
//     }
//     return false;  
// }

