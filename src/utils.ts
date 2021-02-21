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

export function findTheHighlightedSquares(board_copy:Array<Array<Piece>>, clicked_piece : Piece, temp_squareColor: Array<Array<string>>, i:number, j:number){
    let moves; // variable used to store the set of valid moves for the piece we clicked. These moves are stored in the Piece object (see initlaBoard)
    
    // We have to consider Pawns separately because their valid moves change depending on if it's the first time the pawn is moved
    if(clicked_piece.piece === "Pawn"){
    
        if(clicked_piece.moved_before === false){ // it's the first time moving this pawn
            moves = clicked_piece.move_Pawn_firstTime; // use the set of valid moves that are specific to the pawn's first move
        } else {
            moves = clicked_piece.move; // pawn has been moved before; use the set of moves specific to that case
        }
    
        highlightPawn(temp_squareColor, i, j, moves as Move[]); // function to alter the temp_squareColor array that will be used in setState => passed and changed by reference
        return;
    
    } else if (clicked_piece.piece === "Bishop"){

        moves = clicked_piece.move;
        highlightBishop(board_copy, temp_squareColor, i, j, moves as Move[]);
        return;
    }
    
}

/****************************************************************************************************/

function highlightPawn(temp_squareColor: Array<Array<string>>, i:number, j:number, moves:Move[]){    
    if (moves != undefined){ // to be removed: just here for now because I haven't defined the valid moves for all the different pieces, so it could be undefined for anything but a pawn 
        let move_x:number;
        let move_y:number;
        for(let temp = 0; temp < moves.length; temp++){ // looping through the sets of valid moves (many per piece) and changing the color of those locations in the color array to pink
            move_x = i + moves[temp].x ; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
            move_y = j + moves[temp].y;
            if(move_x < 8 && move_y < 8){ // i dont't know how the code was working without this check??? what if the pawn is on the left edge and we find a valid move to be to the top left? Shoudl be getting out of bounds error but was not ??
                temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)
            }
        }
    }    
}

/****************************************************************************************************/

function highlightBishop(board_copy: Array<Array<Piece>>, temp_squareColor: Array<Array<string>>, i:number, j:number, moves:Move[]){    
    if (moves != undefined){ // to be removed: just here for now because I haven't defined the valid moves for all the different pieces, so it could be undefined for anything but a pawn 
        let move_x:number;
        let move_y:number;
        for(let temp = 0; temp < moves.length; temp++){ // looping through the sets of valid moves (many per piece) and changing the color of those locations in the color array to pink
            
            for (let count = 1; count < 8; count++){
                move_x = i + count * moves[temp].x ; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
                move_y = j + count * moves[temp].y;
                if(move_x < 8 && move_x >= 0 && move_y < 8 && move_y >= 0){ // i dont't know how the code was working without this check??? what if the pawn is on the left edge and we find a valid move to be to the top left? Shoudl be getting out of bounds error but was not ??
                    temp_squareColor[move_x][move_y] = "pink"; // changing the location's color to pink (array changed by reference; this changes the array back in startAnalysis)
                }
            }
        }
    }    
}

/****************************************************************************************************/
// function to analyze if the location the user clicked is a valid move for the piece they previously clicked
export function makeMove(board_copy : Array<Array<Piece>>, i:number, j:number, previous_i: number, previous_j:number, instance:any, default_squareColor:Array<Array<string>>  ){
    
    // value and location of the previously clicked piece
    let previous = board_copy[previous_i][previous_j];

    let valid_moves;
    let isValid:boolean;

    // to be changed: right now, just worrying about pawns because they can have 2 different valid move scenarios
    if(previous.piece === "Pawn"){
    
        if(previous.moved_before === false){
            valid_moves = previous.move_Pawn_firstTime;
        } else {
            valid_moves = previous.move;
        }    
        // calling isValid to check if the proposed move is valid. it will use the location of the piece, the proposed destination for the piece, and the set of valid moves for the piece
        isValid = isValidMovePawn(valid_moves as Move[], previous_i as number, previous_j as number, i, j);
    
    } else {
        valid_moves = previous.move;
        isValid = isValidMoveBishop(valid_moves as Move[], previous_i as number, previous_j as number, i, j);
    }
    
    if(isValid){
        // swapping the elements in the board (the current one we clicked with the previous one we clicked)
        swap(board_copy, i, j, previous_i, previous_j);
        console.log("moved!");

        // specific to pawns: after moving them for the first time, we have to set their moved_before attribute to true. This will enable us to use their second set of valid moves next time we want to move the same pawn
        if(board_copy[i][j].piece === "Pawn" && board_copy[i][j].moved_before === false){
            board_copy[i][j].moved_before = true;
        }

        // update the board and reset the previous selection to be nothing
        instance.setState( () => ({
            board: JSON.parse(JSON.stringify(board_copy)),
            selected_piece: { i : "", j : "", value : "" },
            squareColor: JSON.parse(JSON.stringify(default_squareColor))
        }));
    }
} 

/****************************************************************************************************/
// checking if move is valid by comparing the indeces of the destination square to all the valid indeces.
function isValidMovePawn(valid_moves:Move[], previous_i:number, previous_j:number, i:number, j:number) : boolean {
    // looping through all valid moves for each piece
    for(let index = 0; index < valid_moves.length ; index++){
        // finding the valid indeces by applying the transformations specific to each piece's valid moves
        let potential_move_x = previous_i + valid_moves[index].x;
        let potential_move_y = previous_j + valid_moves[index].y;
        // comparing the indeces of the clicked location to the results of the piece's valid move transformations
        if(i === potential_move_x && j === potential_move_y){
            return true;
        }
    }
    return false;  
}


/****************************************************************************************************/
// checking if move is valid by comparing the indeces of the destination square to all the valid indeces.
function isValidMoveBishop(valid_moves:Move[], previous_i:number, previous_j:number, i:number, j:number) : boolean {
    // looping through all valid moves for each piece
    for(let index = 0; index < valid_moves.length ; index++){

        for (let count = 1; count < 8; count++){
            // finding the valid indeces by applying the transformations specific to each piece's valid moves
            let potential_move_x = previous_i + count * valid_moves[index].x;
            let potential_move_y = previous_j + count * valid_moves[index].y;
            // comparing the indeces of the clicked location to the results of the piece's valid move transformations
            if(i === potential_move_x && j === potential_move_y){
                return true;
            }
        }



        // // finding the valid indeces by applying the transformations specific to each piece's valid moves
        // let potential_move_x = previous_i + valid_moves[index].x;
        // let potential_move_y = previous_j + valid_moves[index].y;
        // // comparing the indeces of the clicked location to the results of the piece's valid move transformations
        // if(i === potential_move_x && j === potential_move_y){
        //     return true;
        // }
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
