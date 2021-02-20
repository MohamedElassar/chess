import darkBishop from '../src/full rez pics/darkBishop.png';
import lightBishop from '../src/full rez pics/lightBishop.png';
import darkKing from '../src/full rez pics/darkKing.png';
import lightKing from '../src/full rez pics/lightKing.png';
import darkKnight from '../src/full rez pics/darkKnight.png';
import lightKnight from '../src/full rez pics/lightKnight.png';
import darkPawn from '../src/full rez pics/darkPawn.png';
import lightPawn from '../src/full rez pics/lightPawn.png';
import darkQueen from '../src/full rez pics/darkQueen.png';
import lightQueen from '../src/full rez pics/lightQueen.png';
import darkRook from '../src/full rez pics/darkRook.png';
import lightRook from '../src/full rez pics/lightRook.png';

export interface Move {
    x: number;
    y: number;
}

export interface Piece {
    image: string;
    piece: string;
    color?: string; // optional because blank squares won't have a piece color element
    moved_before?: boolean; // only applies to pawns because their moving options change as the game progressess
    move?: Move[]; 
    // an array of the type "Move", where each Move is an object with the x and y that define each chess piece's moves
    // cool thing is that the property "move" can be of variable length due to this definition "Move[]"
    // this is important because some chess pieces have way more possible moves than others  
    move_Pawn_firstTime?: Move[];
}

let dark_Rook:Piece = {
    image: darkRook,
    piece: "Rook",
    color: "dark",
};

let dark_Knight:Piece = {
    image: darkKnight,
    piece: "Knight",
    color: "dark"
};

let dark_Bishop:Piece = {
    image: darkBishop,
    piece: "Bishop",
    color: "dark"
};

let dark_Queen:Piece = {
    image: darkQueen,
    piece: "Queen",
    color: "dark"
};

let dark_King:Piece = {
    image: darkKing,
    piece: "King",
    color: "dark"
};

let dark_Pawn:Piece = {
    image: darkPawn,
    piece: "Pawn",
    color: "dark",
    moved_before: false
};

let light_Rook:Piece = {
    image: lightRook,
    piece: "Rook",
    color: "light",
};

let light_Knight:Piece = {
    image: lightKnight,
    piece: "Knight",
    color: "light"
};

let light_Bishop:Piece = {
    image: lightBishop,
    piece: "Bishop",
    color: "light"
};

let light_Queen:Piece = {
    image: lightQueen,
    piece: "Queen",
    color: "light"
};

let light_King:Piece = {
    image: lightKing,
    piece: "King",
    color: "light"
};

let light_Pawn:Piece = {
    image: lightPawn,
    piece: "Pawn",
    color: "light",
    moved_before: false,
    move_Pawn_firstTime: [{
        x: -1,
        y: 0
    }, {
        x: -2,
        y: 0
    }],
    move: [{
        x: -1,
        y: -1
    }, {
        x: -1,
        y: 1
    }]
};

let blank:Piece = {
    image: "",
    piece: ""
}

export let pieces = [
    [dark_Rook, dark_Knight, dark_Bishop, dark_Queen, dark_King, dark_Bishop, dark_Knight, dark_Rook],
    new Array(8).fill(dark_Pawn),
    new Array(8).fill(blank),
    new Array(8).fill(blank),
    new Array(8).fill(blank),
    new Array(8).fill(blank),
    new Array(8).fill(light_Pawn),
    [light_Rook, light_Knight, light_Bishop, light_Queen, light_King, light_Bishop, light_Knight, light_Rook],
];