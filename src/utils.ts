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

export function findTheHighlightedSquares(clicked_piece : Piece, temp_squareColor: Array<Array<string>>, i:number, j:number){
    let moves;
    if(clicked_piece.piece === "Pawn"){
        if(clicked_piece.moved_before === false){
            moves = clicked_piece.move_Pawn_firstTime;
        } else {
            moves = clicked_piece.move;    
        }
    } else {
        moves = clicked_piece.move;
    }
    
    highlight(temp_squareColor, i, j, moves as Move[]);
}

/****************************************************************************************************/

function highlight(temp_squareColor: Array<Array<string>>, i:number, j:number, moves:Move[]){    
    if (moves != undefined){
        let move_x:number;
        let move_y:number;
        for(let temp = 0; temp < moves.length; temp++){
            move_x = moves[temp].x ; 
            move_y = moves[temp].y;
            temp_squareColor[i + move_x][j + move_y] = "pink"
        }
    }    
}

/****************************************************************************************************/

export function makeMove(board_copy : Array<Array<Piece>>, i:number, j:number, previous_i: number, previous_j:number, instance:any, default_squareColor:Array<Array<string>>  ){
    
    let previous = board_copy[previous_i][previous_j];

    let valid_moves;

    if(previous.piece === "Pawn" && previous.moved_before === false){
        valid_moves = previous.move_Pawn_firstTime;
    } else if(previous.piece === "Pawn" && previous.moved_before === true) {
        valid_moves = previous.move;
    }
    
    let isValid:boolean = isValidMove(valid_moves as Move[], previous_i as number, previous_j as number, i, j);

    if(isValid){

        swap(board_copy, i, j, previous_i, previous_j);
        console.log("moved!");

        if(board_copy[i][j].piece === "Pawn" && board_copy[i][j].moved_before === false){
            board_copy[i][j].moved_before = true;
        }

        console.log(board_copy);

        // update the board and reset the previous selection to be nothing
        instance.setState( () => ({
            board: JSON.parse(JSON.stringify(board_copy)),
            selected_piece: { i : "", j : "", value : "" },
            squareColor: JSON.parse(JSON.stringify(default_squareColor))
        }));
    }
} 

/****************************************************************************************************/

function isValidMove(valid_moves:Move[], previous_i:number, previous_j:number, i:number, j:number) : boolean {
    for(let index = 0; index < valid_moves.length ; index++){
        let potential_move_x = previous_i + valid_moves[index].x;
        let potential_move_y = previous_j + valid_moves[index].y;
        if(i === potential_move_x && j === potential_move_y){
            return true;
        }
    }
    return false;  
}

/****************************************************************************************************/

function swap(board_copy : Array<Array<Piece>>, i:number, j:number, previous_i: number, previous_j:number){
    let temp = board_copy[i][j];
    board_copy[i][j] = board_copy[previous_i][previous_j];
    board_copy[previous_i][previous_j] = temp;
}
