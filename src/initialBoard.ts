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
    color: string; // optional because blank squares won't have a piece color element
    moved_before?: boolean; // only applies to pawns because their moving options change as the game progressess
    move: Move[]; 
    // an array of the type "Move", where each Move is an object with the x and y that define each chess piece's moves
    // cool thing is that the property "move" can be of variable length due to this definition "Move[]"
    // this is important because some chess pieces have way more possible moves than others  
    move_Pawn_firstTime?: Move[];
}

let dark_Rook:Piece = {
    image: darkRook,
    piece: "Rook",
    color: "black",
    moved_before: false,
    move: [
        {
            x: 0,
            y: 1
        },
        {
            x: 0,
            y: -1
        },
        {
            x: -1,
            y: 0
        },
        {
            x: 1,
            y: 0
        },
    ]
};

let dark_Knight:Piece = {
    image: darkKnight,
    piece: "Knight",
    color: "black",
    move: [
        {
            x: -1,
            y: 2
        },
        {
            x: -2,
            y: 1
        },
        {
            x: -2,
            y: -1
        },
        {
            x: -1,
            y: -2
        },
        {
            x: 1,
            y: -2
        },
        {
            x: 2,
            y: -1
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 2
        },
    ]
};

let dark_Bishop:Piece = {
    image: darkBishop,
    piece: "Bishop",
    color: "black",
    move: [
        {
            x: -1,
            y: 1
        },
        {
            x: -1,
            y: -1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: -1
        },
    ]
};

let dark_Queen:Piece = {
    image: darkQueen,
    piece: "Queen",
    color: "black",
    move: [
        {
            x: -1,
            y: 1
        },
        {
            x: -1,
            y: -1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: -1
        },
        {
            x: 0,
            y: 1
        },
        {
            x: 0,
            y: -1
        },
        {
            x: -1,
            y: 0
        },
        {
            x: 1,
            y: 0
        }
    ]
};

let dark_King:Piece = {
    image: darkKing,
    piece: "King",
    color: "black",
    moved_before: false,
    move:[
        {
            x:0,
            y:1
        },
        {
            x:0,
            y:-1
        },
        {
            x:-1,
            y:0
        },
        {
            x:-1,
            y:-1
        },
        {
            x:-1,
            y:1
        },
        {
            x:1,
            y:0
        },
        {
            x:1,
            y:-1
        },
        {
            x:1,
            y:1
        },
    ]
};

let dark_Pawn:Piece = {
    image: darkPawn,
    piece: "Pawn",
    color: "black",    
    moved_before: false,
    move_Pawn_firstTime: [
        {
            x: 1,
            y: 0
        }, 
        {
            x: 2,
            y: 0
        },
        // the next 2 elements are here because a pawn can also capture diagonally on its firs move 
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: -1
        }
    ],
    move: [ // tbd: the first element in move is the ability of the pawn to move forward one step. The other 2 are the ability to capture
        {
            x: 1,
            y: 0
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: -1
        }
    ]
};

let light_Rook:Piece = {
    image: lightRook,
    piece: "Rook",
    color: "white",
    moved_before: false,
    move: [
        {
            x: 0,
            y: 1
        },
        {
            x: 0,
            y: -1
        },
        {
            x: -1,
            y: 0
        },
        {
            x: 1,
            y: 0
        },
    ]
};

let light_Knight:Piece = {
    image: lightKnight,
    piece: "Knight",
    color: "white",
    move: [
        {
            x: -1,
            y: 2
        },
        {
            x: -2,
            y: 1
        },
        {
            x: -2,
            y: -1
        },
        {
            x: -1,
            y: -2
        },
        {
            x: 1,
            y: -2
        },
        {
            x: 2,
            y: -1
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 2
        },
    ]
};

let light_Bishop:Piece = {
    image: lightBishop,
    piece: "Bishop",
    color: "white",
    move: [
        {
            x: -1,
            y: 1
        },
        {
            x: -1,
            y: -1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: -1
        },
    ]
};

let light_Queen:Piece = {
    image: lightQueen,
    piece: "Queen",
    color: "white",
    move: [
        {
            x: -1,
            y: 1
        },
        {
            x: -1,
            y: -1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: -1
        },
        {
            x: 0,
            y: 1
        },
        {
            x: 0,
            y: -1
        },
        {
            x: -1,
            y: 0
        },
        {
            x: 1,
            y: 0
        }
    ]
};

let light_King:Piece = {
    image: lightKing,
    piece: "King",
    color: "white",
    moved_before: false,
    move:[
        {
            x:0,
            y:1
        },
        {
            x:0,
            y:-1
        },
        {
            x:-1,
            y:0
        },
        {
            x:-1,
            y:-1
        },
        {
            x:-1,
            y:1
        },
        {
            x:1,
            y:0
        },
        {
            x:1,
            y:-1
        },
        {
            x:1,
            y:1
        },
    ]
};

let light_Pawn:Piece = {
    image: lightPawn,
    piece: "Pawn",
    color: "white",
    moved_before: false,
    move_Pawn_firstTime: [
        {
            x: -1,
            y: 0
        }, 
        {
            x: -2,
            y: 0
        },
        // the next 2 elements are here because a pawn can also capture diagonally on its firs move 
        {
            x: -1,
            y: -1
        },
        {
            x: -1,
            y: 1
        }
    ],
    move: [ // tbd: the first element in move is the ability of the pawn to move forward one step. The other 2 are the ability to capture
        {
            x: -1,
            y: 0
        },
        {
            x: -1,
            y: -1
        },
        {
            x: -1,
            y: 1
        }
    ]
};

let blank:Piece = {
    image: "",
    piece: "",
    color: "",
    move:[]
}

// used to initialize the board in the App component index.js
export let pieces = [
    [Object.assign({}, dark_Rook), Object.assign({}, dark_Knight), Object.assign({}, dark_Bishop), dark_Queen, dark_King, Object.assign({}, dark_Bishop), Object.assign({}, dark_Knight), Object.assign({}, dark_Rook)],
    new Array(8).fill(Object.assign({}, dark_Pawn)),
    new Array(8).fill(blank),
    new Array(8).fill(blank),
    new Array(8).fill(blank),
    new Array(8).fill(blank),
    new Array(8).fill(Object.assign({}, light_Pawn)),
    [Object.assign({}, light_Rook), Object.assign({}, light_Knight), Object.assign({}, light_Bishop), light_Queen, light_King, Object.assign({}, light_Bishop), Object.assign({}, light_Knight), Object.assign({}, light_Rook)],
];

// options for the user to promote the pawn when able to. used in move.ts in promotePawn()
export let pawnPromotions = {
    "white": {
        "bishop": light_Bishop,
        "queen": light_Queen,
        "rook": light_Rook,
        "knight": light_Knight
    },
    "black": {
        "bishop": dark_Bishop,
        "queen": dark_Queen,
        "rook": dark_Rook,
        "knight": dark_Knight
    }
};