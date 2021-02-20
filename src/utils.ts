import {Piece, Move} from './initialBoard'; // importing the interfaces from the initalBoard file which defines each piece object
import {SelectedPiece} from './startAnalysis';

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

export function findTheHighlightedSquares(clicked_piece : Piece, temp_squareColor: Array<Array<string>>, i:number, j:number){
    if(clicked_piece.piece === "Pawn" && clicked_piece.color === "light"){
        let moves = clicked_piece.move;
        let didMoveBefore = clicked_piece.moved_before;
        if(!didMoveBefore){
            let move_x:number;
            let move_y:number;
            if (moves != undefined){
                move_x = moves[0].x ; 
                move_y = moves[0].y;
                temp_squareColor[i + move_x][j + move_y] = "pink"
            }
        }
    }
}

export function makeMove(board_copy : Array<Array<Piece>>, i:number, j:number, previous_i: number, previous_j:number  ){
    let temp = board_copy[i][j];
    board_copy[i][j] = board_copy[previous_i][previous_j];
    board_copy[previous_i][previous_j] = temp;
}