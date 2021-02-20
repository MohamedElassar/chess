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

let dark_Rook = {
    image: darkRook,
    piece: "Rook",
    color: "dark"
};

let dark_Knight = {
    image: darkKnight,
    piece: "Knight",
    color: "dark"
};

let dark_Bishop = {
    image: darkBishop,
    piece: "Bishop",
    color: "dark"
};

let dark_Queen = {
    image: darkQueen,
    piece: "Queen",
    color: "dark"
};

let dark_King = {
    image: darkKing,
    piece: "King",
    color: "dark"
};

let dark_Pawn = {
    image: darkPawn,
    piece: "Pawn",
    color: "dark",
    moved_before: false
};

let light_Rook = {
    image: lightRook,
    piece: "Rook",
    color: "light",
};

let light_Knight = {
    image: lightKnight,
    piece: "Knight",
    color: "light"
};

let light_Bishop = {
    image: lightBishop,
    piece: "Bishop",
    color: "light"
};

let light_Queen = {
    image: lightQueen,
    piece: "Queen",
    color: "light"
};

let light_King = {
    image: lightKing,
    piece: "King",
    color: "light"
};

let light_Pawn = {
    image: lightPawn,
    piece: "Pawn",
    color: "light",
    moved_before: false
};

let blank = {
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
]

// pieces: [
//     [darkRook, darkKnight, darkBishop, darkQueen, darkKing, darkBishop, darkKnight, darkRook],
//     new Array(8).fill(darkPawn),
//     new Array(8).fill(""),
//     new Array(8).fill(""),
//     new Array(8).fill(""),
//     new Array(8).fill(""),
//     new Array(8).fill(lightPawn),
//     [lightRook, lightKnight, lightBishop, lightQueen, lightKing, lightBishop, lightKnight, lightRook],
// ]