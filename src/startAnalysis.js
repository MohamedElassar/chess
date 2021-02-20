export function startAnalysis(instance, i, j, clicked_piece, state, default_squareColor){

    let previous_value = state.selected_piece.value;
    let previous_i = state.selected_piece.i;
    let previous_j = state.selected_piece.j;

    switch (previous_value == "") {

        case true:
            switch (clicked_piece.piece == "") {
                case true:
                    instance.setState( (prevState) => ({
                        selected_piece: { i : i, j : j, value : clicked_piece.piece },
                        squareColor: default_squareColor
                        }));
                break;
                case false:
                    let temp_squareColor = default_squareColor.map((value) => value.slice());
                    temp_squareColor[i-1][j] = "pink";
                    
                    instance.setState({
                        selected_piece: { i : i, j : j, value : clicked_piece.piece },
                        squareColor: temp_squareColor
                        });
                break;
            }
        break;

        case false:
            switch (clicked_piece.piece == "") {
                case true:
                    //if we clicked a blank square with our previous selection being a non-empty square i.e. we'll start to analyze if a move is ok
                    console.log("moved!");
                    //making a copy of the board to be updated
                    let board_copy = [...state.board];
                    // swapping the elements in the board (the current one we clicked with the previous one we clicked)
                    let temp = board_copy[i][j];
                    board_copy[i][j] = board_copy[previous_i][previous_j];    
                    board_copy[previous_i][previous_j] = temp;
                    // update the board and reset the previous selection to be nothing
                    instance.setState( (prevState) => ({
                        board: [...board_copy],
                        selected_piece: { i : "", j : "", value : "" },
                        squareColor: default_squareColor.map((value) => value.slice())
                    }));
                break;
                case false:
                    let temp_squareColor = default_squareColor.map((value) => value.slice());
                    temp_squareColor[i-1][j] = "pink";
                    
                    instance.setState({
                        selected_piece: { i : i, j : j, value : clicked_piece.piece },
                        squareColor: temp_squareColor
                        });
                break;
            }
        break;
    }
    
    // if(previous_value  == "" || clicked_piece.piece != ""){ 
    //     // if we clicked a non-empty empty square, or if the previous square we clicked was empty
    //     // We update the previous selected element to be the current one we clicked. instance will be used for comparison with the next click
        
    //     let temp_squareColor = [...instance.state.squareColor];
    //     temp_squareColor[i-1][j] = "pink";
        
    //     instance.setState({
    //         selected_piece: { i : i, j : j, value : clicked_piece.piece },
    //         squareColor: [...temp_squareColor]
    //         }
    //     );
    
    // } else if(clicked_piece.piece == "" && previous_value != "") {
    //     //if we clicked a blank square with our previous selection being a non-empty square i.e. we'll start to analyze if a move is ok
    //     console.log("moved!");
    //     //making a copy of the board to be updated
    //     let board_copy = [...state.board];
    //     // swapping the elements in the board (the current one we clicked with the previous one we clicked)
    //     let temp = board_copy[i][j];
    //     board_copy[i][j] = board_copy[previous_i][previous_j];    
    //     board_copy[previous_i][previous_j] = temp;
    //     // update the board and reset the previous selection to be nothing
    //     instance.setState({
    //         board: [...board_copy],
    //         selected_piece: { i : "", j : "", value : "" },
    //         squareColor: state.default_squareColor
    //     });
    // }

}
