import {Piece, Move} from './initialBoard'; // importing the interfaces from the initalBoard file which defines each piece object
import {State} from './startAnalysis'; 
/****************************************************************************************************/

export function willMovingHereCheckMe(state:State, board_copy:Array<Array<Piece>>, move_x:number, move_y:number, i:number, j:number) : boolean{

    let pieceInvestigating = board_copy[i][j];

    let currentColor = pieceInvestigating.color;

    // copy of the board where we will simualte the move to the highlighted square and see if moving there will check myself
    let simualtingBoard = JSON.parse(JSON.stringify(board_copy));
    let copyForPawnMovementAnalysis = JSON.parse(JSON.stringify(board_copy));

    // moving the clicked piece to the proposed location
    simualtingBoard[move_x][move_y] = pieceInvestigating;
    simualtingBoard[i][j] = {image: "", piece: "", color: "", move:[]};

    let [king_x, king_y] = findMyKing(simualtingBoard, currentColor); 

    let enemyPossibleCaptureLocations = getAllAttackLocations(state, simualtingBoard, copyForPawnMovementAnalysis, currentColor);

    for(let index = 0; index < enemyPossibleCaptureLocations.length; index++){
        for(let indexx = 0 ; indexx < enemyPossibleCaptureLocations[index].length ; indexx++){
            let x = enemyPossibleCaptureLocations[index][indexx].x;
            let y = enemyPossibleCaptureLocations[index][indexx].y;
            if(x === king_x && y === king_y){
                return true;
            }
        }
    }

    return false;

}

/****************************************************************************************************/

function findMyKing(simualtingBoard:Array<Array<Piece>>, color:string) : number[] {
    for (let i = simualtingBoard.length - 1; i >= 0; i--) {
        for(let j = 0; j < simualtingBoard.length ; j++){
            if(simualtingBoard[i][j].piece === "King" && simualtingBoard[i][j].color === color){
                return [i, j];
            }
        }
    }
    return [0, 0]; // JUST A PLACEHOLDER TO MAKE THIS FUNCTION WORK
}

/****************************************************************************************************/

export function findEnemyKing(simualtingBoard:Array<Array<Piece>>, color:string) : number[] {
    for (let i = simualtingBoard.length - 1; i >= 0; i--) {
        for(let j = 0; j < simualtingBoard.length ; j++){
            if(simualtingBoard[i][j].piece === "King" && simualtingBoard[i][j].color !== color){
                return [i, j];
            }
        }
    }
    return [0, 0]; // JUST A PLACEHOLDER TO MAKE THIS FUNCTION WORK
}

/****************************************************************************************************/

export function getAllAttackLocations(state:State, simualtingBoard:Array<Array<Piece>>, copyForPawnMovementAnalysis:Array<Array<Piece>>, color:string) : Move[][] {

    let enemyPossibleCaptureLocations:Move[][] = [];

    for(let i = 0; i < simualtingBoard.length ; i++){
        for(let j = 0; j < simualtingBoard.length; j++){
            if(simualtingBoard[i][j].piece !== "" && simualtingBoard[i][j].color !== color){

                if(simualtingBoard[i][j].piece === "King" || simualtingBoard[i][j].piece === "Knight"){
                    enemyPossibleCaptureLocations.push( highlightFixed(simualtingBoard, i, j, simualtingBoard[i][j].move) );
                } else if(simualtingBoard[i][j].piece === "Bishop" || simualtingBoard[i][j].piece === "Rook" || simualtingBoard[i][j].piece === "Queen"){
                    enemyPossibleCaptureLocations.push( highlightDynamic(state, simualtingBoard, i, j, simualtingBoard[i][j].move) );
                } else {
                    enemyPossibleCaptureLocations.push( highlightPawn(simualtingBoard, copyForPawnMovementAnalysis, i, j, simualtingBoard[i][j]) );   
                }


            }
        }
    }

    return enemyPossibleCaptureLocations;

}

/****************************************************************************************************/
// function to find the spots to highlight on the puzzle for pieces with a fixed pattern of movement i.e. no diagonals / no moves that extend to either end of the puzzle
// applies to Pawn, Knight, King BUT Knights are the only puzzle piece that can skip over other pieces
function highlightFixed(board_copy: Array<Array<Piece>> , i:number, j:number, moves:Move[]) : Array<Move> {    
        
    let move_x:number;
    let move_y:number;
    let valid_moves: Array<Move> = [];

    for(let temp = 0; temp < moves.length; temp++){ // looping through the sets of valid moves (many per piece) and changing the color of those locations in the color array to pink
        move_x = i + moves[temp].x ; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
        move_y = j + moves[temp].y;
        if(move_x < 8 && move_x >= 0 && move_y < 8 && move_y >= 0){ // check to ensure that we don't get a "index out of bound" error 
            
            if(board_copy[move_x][move_y].piece === "" || board_copy[move_x][move_y].color !== board_copy[i][j].color){ // check to only highlight the pieces that are not occupied by pieces of the same color
                            
                    valid_moves.push(
                        {
                        x: move_x, 
                        y: move_y 
                        });

            } 
        }
    }

    // checkForCastling(state, board_copy, i, j, valid_moves);

    return valid_moves;

}

/****************************************************************************************************/
// function to find the spots to highlight on the puzzle for pieces with a fixed pattern of movement i.e. no diagonals / no moves that extend to either end of the puzzle
// applies to Pawn, Knight, King BUT Knights are the only puzzle piece that can skip over other pieces
function highlightPawn(board_copy: Array<Array<Piece>> , copyForPawnMovementAnalysis:Array<Array<Piece>> , i:number, j:number, clicked_piece:Piece) : Array<Move> {    

    console.log("here");

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

                valid_moves.push(
                    {
                    x: move_x, 
                    y: move_y 
                    });

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

                    valid_moves.push(
                        {
                        x: move_x, 
                        y: move_y 
                        });
                    } 
            }

        }

    } else {

        // handling the ability to move up one square if free
        moves = clicked_piece.move as Array<Move>;

        move_x = i + moves[0].x; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
        move_y = j + moves[0].y;

        if(board_copy[move_x][move_y].piece === ""){

                valid_moves.push(
                    {
                    x: move_x, 
                    y: move_y 
                    });

        }

        // checking if we can highlight the corner squares if there's potential for capturing
        for(let index = 1; index < moves.length; index++){

            move_x = i + moves[index].x; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
            move_y = j + moves[index].y;

            if(move_x < 8 && move_x >= 0 && move_y < 8 && move_y >= 0){    

                if(board_copy[move_x][move_y].piece !== "" && board_copy[move_x][move_y].color !== board_copy[i][j].color){

                    valid_moves.push(
                        {
                        x: move_x, 
                        y: move_y 
                        });

                }

            }
        }

        // handling the En Passant rule for pawns - TBD stupid method

        let pawn_color = clicked_piece.color;

        if(pawn_color === "white"){
            if(j-1 >= 0){
                if(board_copy[i][j-1].piece === "Pawn" && board_copy[i][j-1].color !== board_copy[i][j].color){
                    let previous_board = copyForPawnMovementAnalysis;
                    let previous_opponent_location = previous_board[i][j-1];
                    if(previous_opponent_location.piece === "" && previous_board[i-2][j-1].piece === "Pawn" && previous_board[i-2][j-1].moved_before === false){

                        valid_moves.push(
                            {
                            x: i-1, 
                            y: j-1 
                            });
    
                    }
                }
            } 
            
            if(j+1 < board_copy.length){
                if(board_copy[i][j+1].piece === "Pawn" && board_copy[i][j+1].color !== board_copy[i][j].color){
                    let previous_board = copyForPawnMovementAnalysis;
                    let previous_opponent_location = previous_board[i][j+1];
                    if(previous_opponent_location.piece === "" && previous_board[i-2][j+1].piece === "Pawn" && previous_board[i-2][j+1].moved_before === false){

                        valid_moves.push(
                            {
                            x: i-1, 
                            y: j+1 
                            });
    
                    }
                }
            }

        } else if(pawn_color === "black"){
            if(j-1 >= 0){
                if(board_copy[i][j-1].piece === "Pawn" && board_copy[i][j-1].color !== board_copy[i][j].color){
                    let previous_board = copyForPawnMovementAnalysis;
                    let previous_opponent_location = previous_board[i][j-1];
                    if(previous_opponent_location.piece === "" && previous_board[i+2][j-1].piece === "Pawn" && previous_board[i+2][j-1].moved_before === false){

                        valid_moves.push(
                            {
                            x: i+1, 
                            y: j-1 
                            });

                    }
                }
            } 
            
            if(j+1 < board_copy.length){
                if(board_copy[i][j+1].piece === "Pawn" && board_copy[i][j+1].color !== board_copy[i][j].color){
                    let previous_board = copyForPawnMovementAnalysis;
                    let previous_opponent_location = previous_board[i][j+1];
                    if(previous_opponent_location.piece === "" && previous_board[i+2][j+1].piece === "Pawn" && previous_board[i+2][j+1].moved_before === false){

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

    return valid_moves;

}

/****************************************************************************************************/
// function to find the spots to highlight on the puzzle for pieces with a dynamic pattern of movement i.e. diagonals, moves that extend to either end of the puzzle
// applies to Bishops, Queens, Rooks
// NOTE: these pieces CANNOT skip over pieces in their proposed path 
function highlightDynamic(state:State, board_copy: Array<Array<Piece>>, i:number, j:number, moves:Move[]) : Array<Move>{    

    let move_x:number;
    let move_y:number;
    let valid_moves: Array<Move> = [];

    for(let temp = 0; temp < moves.length; temp++){ // looping through the sets of valid moves (many per piece) and changing the color of those locations in the color array to pink
        
        for (let count = 1; count < 8; count++){ // I have to loop through multiple possibilites for each given move; this is to catch the diagonal aspect. e.g. if 1, 1 is a possible move, I need to also check if 2,2 and 3,3, etc. are valid diagonal moves
            
            move_x = i + count * moves[temp].x ; // moves is an array of "Moves"; see initialBoard for interface. it's an object with x and y representing the alteration to be made to the array location
            move_y = j + count * moves[temp].y;
            
            if(move_x < 8 && move_x >= 0 && move_y < 8 && move_y >= 0){ // check to ensure that we don't get a "index out of bound" error
                
                if(board_copy[move_x][move_y].piece === ""){  // highlighting an empty square in the piece's proposed path

                    valid_moves.push(
                        {
                        x: move_x, 
                        y: move_y 
                        });
                    
                } else if (board_copy[move_x][move_y].color !== board_copy[i][j].color){ // highlighting a non-empty square that must be of the opposite color. This shows that we can capture this piece
                
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
}
