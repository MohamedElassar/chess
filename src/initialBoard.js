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
    value: "darkRook"
};

let dark_Knight = {
    image: darkKnight,
    value: "darkKnight"
};

let dark_Bishop = {
    image: darkBishop,
    value: "darkBishop"
};

let dark_Queen = {
    image: darkQueen,
    value: "darkQueen"
};

let dark_King = {
    image: darkKing,
    value: "darkKing"
};

let dark_Pawn = {
    image: darkPawn,
    value: "darkPawn",
    moved_before: false
};

let light_Rook = {
    image: lightRook,
    value: "lightRook"
};

let light_Knight = {
    image: lightKnight,
    value: "lightKnight"
};

let light_Bishop = {
    image: lightBishop,
    value: "lightBishop"
};

let light_Queen = {
    image: lightQueen,
    value: "lightQueen"
};

let light_King = {
    image: lightKing,
    value: "lightKing"
};

let light_Pawn = {
    image: lightPawn,
    value: "lightPawn",
    moved_before: false
};

let blank = {
    image: "",
    value: ""
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