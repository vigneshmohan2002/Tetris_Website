const start_game = document.querySelector('#start-button')
let timerId;
let score = 0;
let game_end = false;
const tetrominoes =
    {
        "L":
            {
                0: [ [1,1],[1,2],[1,3],[2,3] ],
                1: [ [1,3],[2,3],[3,3],[3,2] ],
                2: [ [1,1],[2,1],[2,2],[2,3] ],
                3: [ [1,2],[1,1],[2,1],[3,1] ]
            },

        "Z":
            {
                0: [ [1,1],[1,2],[2,2],[2,3] ],
                1: [ [1,3],[2,3],[2,2],[3,2] ],
                2: [ [1,1],[1,2],[2,2],[2,3] ],
                3: [ [1,3],[2,3],[2,2],[3,2] ]
            },

        "S":
            {
                0: [ [1,2],[1,3],[2,1],[2,2] ],
                1: [ [1,2],[2,2],[2,3],[3,3] ],
                2: [ [1,2],[1,3],[2,1],[2,2] ],
                3: [ [1,2],[2,2],[2,3],[3,3] ]
            },

        "T":
            {
                0: [ [1,1],[2,1],[2,2],[3,1] ],
                1: [ [1,1],[1,2],[2,2],[1,3] ],
                2: [ [1,3],[2,3],[2,2],[3,3] ],
                3: [ [3,1],[3,2],[2,2],[3,3] ]
            },

        "I":
            {
                0: [ [1,1],[1,2],[1,3],[1,4] ],
                1: [ [1,1],[2,1],[3,1],[4,1] ],
                2: [ [1,1],[1,2],[1,3],[1,4] ],
                3: [ [1,1],[2,1],[3,1],[4,1] ]
            },

        "O":
            {
                0: [ [1,1],[1,2],[2,1],[2,2] ],
                1: [ [1,1],[1,2],[2,1],[2,2] ],
                2: [ [1,1],[1,2],[2,1],[2,2] ],
                3: [ [1,1],[1,2],[2,1],[2,2] ]
            }
    };


function tetromino_access(tetro, rotation)
{
    let to_give = tetrominoes[tetro][rotation]
    let output_coords = [ [0,0],[0,0],[0,0],[0,0] ]
    for(let i=0; i<4; i++)
    {
        output_coords[i][0] = to_give[i][0];
        output_coords[i][1] = to_give[i][1];
    }
    return output_coords
}

// When a block's position is set add set to the string.
let tetrisDS =
    [
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""]
    ];
const empty_tetrisDS =
    [
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""]
];

let currentBlock;

function generateStartingPos(coords)
{
    let width = 0;
    for (let i = 0; i < 4; i++)
    {
        if (coords[i][1] > width)
        {
            width = coords[i][1];
        }
    }
    switch (width)
    {
        case 1:
            // width is 1 so shift it 4 blocks to the right
            for (let i = 0; i < 4; i++)
            {
                coords[i][0] -= 1;
                coords[i][1] += 3;
            }
            break;
        case 2:
            // width is 2 so shift it 4 blocks to the right
            for (let i = 0; i < 4; i++)
            {
                coords[i][0] -= 1;
                coords[i][1] += 3;
            }
            break;
        case 3:
            // width is 3 so shift it 3 blocks to the right
            for (let i = 0; i < 4; i++)
            {
                coords[i][0] -= 1; // Adjusting coords for 0 index
                coords[i][1] += 3;
            }
            break;
        case 4:
            // width is 4 so shift it 3 blocks to the right
            for (let i = 0; i < 4; i++)
            {
                coords[i][0] -= 1; // Adjusting coords for 0 index
                coords[i][1] += 2;
            }
            break;
    }
    return coords;
}


function moveChecker(potential_coords)
{
    // [ [r0, c0], [r1, c1], [r2, c2], [r3, c3] ]
    let move_possible = true
    for(let i=0; i<4; i++)
    {
        // Check if row index and column index is within bounds
        if ((potential_coords[i][0] > 19) ||(potential_coords[i][1] > 9))
        {
            move_possible = false;
            break;
        }
        // Check if there's a set block (will contain suffix "-set")
        // May add below condition if problems arise, however due to the above statement, it should be unnecessary
        // (tetrisDS[potential_coords[i][0]][potential_coords[i][1]] === undefined)
        if ((tetrisDS[potential_coords[i][0]][potential_coords[i][1]].includes("-set")))
        {
            move_possible = false;
            break;
        }
    }
    return move_possible;
}


let gamePiece =
    {
        coords: [],
        id: "",
        down: 0,
        lat: 0,
        rotation: 0,
        updatePos:
            function(new_coords)
            {
                let tetrisDS_copy = tetrisDS
                // Checking move is possible
                if (moveChecker(new_coords))
                {
                    erase();
                    for(let i=0; i<4; i++)
                    {
                        //  Accessing the elements that refer to the new position and setting them to the id.
                        tetrisDS_copy[this.coords[i][0]][this.coords[i][1]] = "";
                    }
                    // Update the position in the tetrisDS
                    for(let i=0; i<4; i++)
                    {
                        //  Accessing the elements that refer to the new position and setting them to the id.
                        tetrisDS_copy[new_coords[i][0]][new_coords[i][1]] = this.id;
                    }
                    this.coords = new_coords
                    tetrisDS = tetrisDS_copy
                    return true; // To show move has been made
                }
                else
                {
                    return false; // To show no move was made
                }
            }
    }

function moveDown(gamepiece)
{
    let new_coords = [[0,0],[0 ,0],[0,0],[0,0]];
    if(gamepiece.coords === undefined)
    {
        clearInterval(timerId);
        return;
    }
    for (let i = 0; i < 4; i++)
    {
        // Changing only the row number
        new_coords[i][0] = gamepiece.coords[i][0] + 1;
        new_coords[i][1] = gamepiece.coords[i][1];
    }
    const pos_update = gamepiece.updatePos(new_coords);
    gamepiece.down += 1; // The block can be set after this meaning it's mistakenly incremented. Doesn't matter cos
    // it will switch to the next block then

    if (!(pos_update))
    {
        // This means the position wasn't updated. Could happen in 2 cases:
        // One of the blocks hit the bottom, or another block. Same consequence.
        set_block(gamepiece);
    }
    draw();
}

function moveLat(gamepiece, LoR)
    {
        // LoR = +1 or -1, +1 would indicate a move to the right and -1 would indicate a move to the right
        let new_coords = [[0,0],[0,0],[0,0],[0,0]];
        for (let i = 0; i < 4; i++)
        {
            new_coords[i][0] = gamepiece.coords[i][0];
            new_coords[i][1] = gamepiece.coords[i][1] + LoR;
        }
        // Move is made if possible
        if (gamepiece.updatePos(new_coords))
        {
            gamepiece.lat += LoR;
            draw();
        }

    }

function rotate(gamepiece)
{
    let potential_rot;
    if ((gamepiece.rotation + 1) <= 3)
    {
        potential_rot = gamepiece.rotation + 1;
    }
    else
    {
        potential_rot = 0;
    }
    let down = gamepiece.down;
    let lat = gamepiece.lat;
    let new_piece_coords = tetromino_access(gamepiece.id, potential_rot);
    let new_coords = generateStartingPos(new_piece_coords);
    for (let i = 0; i < 4; i++)
    {
        new_coords[i][0] = new_piece_coords[i][0] + down;
        new_coords[i][1] = new_piece_coords[i][1] + lat;
    }
    // Move is made if possible
    if (gamepiece.updatePos(new_coords))
    {
        gamepiece.rotation = potential_rot;
        draw();
    }
}

function clear_rows(gamepiece)
{
    const empty_row = ["", "", "", "", "", "", "", "", "", ""];
    let new_tetrisDS = [];
    let tetrisDS_copy = tetrisDS; // Will be tetrisDS without the cleared rows, empty rows are added to this.
    let rows_to_check = [];
    let rows_to_clear = [];
    for(let i=0; i<4; i++)
    {
        if (!rows_to_check.includes(gamepiece.coords[i][0]))
        {
            rows_to_check.push(gamepiece.coords[i][0]);
        }
    }
    erase();
    let checking_row;
    let row_full;
    for(let i=0; i<rows_to_check.length; i++)
    {
        checking_row = tetrisDS_copy[rows_to_check[i]]
        row_full = true;
        if(checking_row === undefined)
        {
            row_full = false;
            continue;
        }
        for (let col = 0; col < 10; col++)
        {
            if (!checking_row[col].includes("-set"))
            {
                row_full = false;
                break;
            }
        }
        if (row_full)
        {
            rows_to_clear.push(rows_to_check[[i]]) // indexes of rows to clear
        }
    }


    // If there are rows to clear, else do nothing
    if (rows_to_clear.length>0)
    {
        for(let r=0; r<rows_to_clear.length; r++)
        {
            new_tetrisDS.push(empty_row)
        }
        for(let row=0; row<tetrisDS_copy.length; row++)
        {
            if (!rows_to_clear.includes(row))
            {
                new_tetrisDS.push(tetrisDS_copy[row])
            }
        }
        tetrisDS = new_tetrisDS.map(function (arr){return arr.slice()})
    }
}

function set_block(gamepiece)
{
    for(let i=0; i<4; i++)
    {
        if (!tetrisDS[gamepiece.coords[i][0]][gamepiece.coords[i][1]].includes("-set"))
        {
            tetrisDS[gamepiece.coords[i][0]][gamepiece.coords[i][1]] += "-set";
        }
    }
    if (gamepiece.id.includes("-set"))
    {
        gamepiece.id += "set";
    }
    clear_rows(gamepiece);
    currentBlock = make_new_gamepiece();
    gamepiece.d = 0
}
function make_new_gamepiece()
{
    let piece = gamePiece;
    // Make it pick a random one, empty string is placeholder.
    const tetro_num = Math.floor(Math.random() * 6);
    let tetro = '';
    switch (tetro_num)
    {
        case 0:
            tetro = "L";
            break;
        case 1:
            tetro = "Z";
            break;
        case 2:
            tetro = "S";
            break;
        case 3:
            tetro = "T";
            break;
        case 4:
            tetro = "O";
            break;
        case 5:
            tetro = "I";
            break;
    }
    piece.id = tetro;
    piece.down = 0;
    piece.lat = 0;
    piece.rotation = 0;
    piece.coords = generateStartingPos(tetromino_access(tetro, 0));
    if(piece.updatePos(piece.coords))
    {
        score++;
        return piece;
    }
    else
    {
        game_over();
        return null;
    }
}
function game_over()
{
    game_end = true
    currentBlock = null;
    clearInterval(timerId);
    document.removeEventListener('keydown', block_mover);
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("score=" + score);
}

function draw()
{
    let color = '';
    for(let row=0; row<20; row++)
    {
        for (let col=0; col<10; col++)
        {
            // Does nothing if the element doesn't contain anything
            if (tetrisDS[row][col] === "")
            {
                continue;
            }
            // If the code flow reaches here, the block will contain an id. Therefore, it will have to be filled in
            // Setting the color
            let id = tetrisDS[row][col]
            switch (id)
            {
                case 'L':
                    color = '#000099';
                    break;
                case 'L-set':
                    color = '#000099';
                    break;
                case 'Z':
                    color = "red";
                    break;
                case 'Z-set':
                    color = "red";
                    break;
                case 'S':
                    color = "green";
                    break;
                case 'S-set':
                    color = "green";
                    break;
                case 'T':
                    color = "purple";
                    break;
                case 'T-set':
                    color = "purple";
                    break;
                case 'O':
                    color = 'yellow';
                    break;
                case 'O-set':
                    color = 'yellow';
                    break;
                case 'I':
                    color = 'cyan';
                    break;
                case 'I-set':
                    color = 'cyan';
                    break;
            }
            // Title is to make selecting the block easier
            let set_title = "row" + row + "col" + col;
            let disp_block = document.createElement("div");
            disp_block.title = set_title;
            disp_block.className = 'block';
            disp_block.id = id;
            disp_block.style.backgroundColor = color;
            disp_block.style.top =  row * 30+  "px";
            disp_block.style.left = col * 30 + "px";
            document.getElementById("tetris-game").appendChild(disp_block);
        }
    }
}


function erase()
{
    let blocks_handled = 0
    for(let row=0; row<20; row++)
    {
        for (let col=0; col<10; col++)
        {
            if ((tetrisDS[row][col] === ""))
            {
                continue;
            }
            // Select one node because only one will have the exact attribute.
            // The row and col is known. row is set via top. col is set via translate.
            let search_title ='[title*=' + ("row" + row + "col" + col) + ']';
            let rem_block = document.getElementById("tetris-game").querySelector(search_title);
            if (rem_block !== null)
            {
                rem_block.remove();
            }
        }
        // Max number of blocks in a gamepiece is 4, so no need to check after this.
        if (blocks_handled === 4)
        {
            break;
        }
    }
}

//assign functions to keyCodes
function block_mover(e)
{
    switch(e.key)
    {
        case ("ArrowRight"):
            moveLat(currentBlock, +1);
            break;
        case ("ArrowLeft"):
            moveLat(currentBlock, -1);
            break;
        case ("ArrowDown"):
            moveDown(currentBlock);
            break;
        case ("ArrowUp"):
            rotate(currentBlock);
            break;
    }
}

start_game.addEventListener('click', () => {
    if (timerId)
    {
        clearInterval(timerId);
        timerId = null;
        document.removeEventListener('keydown', block_mover)
        return;
    }
    if(game_end)
    {
        start_game.style.visibility = "visible";
        erase();
        game_end=false;
        tetrisDS = empty_tetrisDS.map(function (arr){return arr.slice()});
        document.addEventListener('keydown', block_mover);
        currentBlock = make_new_gamepiece();
        draw();
        timerId = setInterval(moveDown, 1000, currentBlock);
    }
    else
    {
        start_game.style.visibility = "hidden";
        document.addEventListener('keydown', block_mover);
        currentBlock = make_new_gamepiece();
        draw();
        timerId = setInterval(moveDown, 1000, currentBlock);
    }
}
)

