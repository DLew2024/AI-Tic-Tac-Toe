/* 
    6 steps
    1. Set up game regularly
    2. Find winner
    3. Win Message
    4. Minimax message
    5. AI communication
    6. Game Restart (Loop back to 2)
*/

/* 
    gameBoard - a variable we wil be using to manipulate and 
    use the game.
    humanPlayer - Stores the character 'X' for the human player.
    aiPlayer - Stores the character 'O' for the AI player.
    winCombinations - a array of arrays with the combination
    of winning choices in TTT. 

    This is the beginning of the game we must set up all
    of the intial features any Tic-Tac-Toe game would have
    which is obviously the board, players, and letting the
    the program know all of the win combinations. 
*/

var gameBoard;
const humanPlayer = 'X';
const aiPlayer = 'O';
const winCombinations = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

/* 
    cells - a variable that keeps track of all the HTML elements 
    with the 'cell' class.

    Stores all the elements with the HTML class of cell into
    a JS constant while starting the game.
*/

const cells = document.querySelectorAll('.cell');
beginGame();

/* 
    gameBoard - An Array that stores bascially 9 elements.

    Starting the game triggers the game to bascially be cleared 
    by removing all the elements added from the previous or 
    new game.
*/

function beginGame() {
    document.querySelector(".gameover").style.display = "none";
    gameBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', clickUpdate, false);
    }
}   

/* 
    Updates the cells on the board after every click
    checks after every click to see if there are any ties.

    Changes turns from player to AI after each turn as well 
    giving the AI a chance to choose the most optimal spot.
*/

function clickUpdate(clickedCell) {
    if (typeof gameBoard[clickedCell.target.id] == 'number') {
        changeTurn(clickedCell.target.id, humanPlayer);
        if (!checkTie()) {
            changeTurn(bestSpot(), aiPlayer)
        };
    }
}

/* 
    When the turns chnage from AI to Player or vice versa.
    The board must be updated with that player 'X' or 'O'..
    It occupies it in the gameBoard array and updates the HTML element.
    Lastly after these are updated it checks if the game is won.
*/

function changeTurn (cellID, player) {
    gameBoard[cellID] = player;
    document.getElementById(cellID).innerText = player;
    let gameWon = winChecker(gameBoard, player);
    if (gameWon) { 
        gameOver(gameWon)
    };
}

/* 
    plays - an array containing the indicies of cells where 
    the player has made a move.
    gameWon - a variable that determines if the winning condition is 
    met.

    This function bascially runs a check of ever play and compares it
    to every winning combination. If the game is one the gameWon 
    variable returns the index and the player or null if not satified.
*/

function winChecker(newBoard, player) {
    let plays = newBoard.reduce((a, e, i) => 
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {
                index: index, 
                player: player
            }
            break;
        }
    }
    return gameWon;
}

/* 
    Function that determines what happens once the game ends.
    With the gameWon variable being passed contianing either null
    or index and player.. It will highlight the winning or losing blocks 
    a color of the choosing. Also specfies to the player where they
    won or loss.
*/

function gameOver(gameWon) {
    for (let index of winCombinations[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "gray" : "gray";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', clickUpdate, false);
    }
    gameOverMessage(gameWon.player == humanPlayer ? "You win!" : "You Lose :(");
}

/* 
    Function that updates the gameover HTML element with the winning or
    losing respons. "who" variable gets passed through with the particular 
    message for the winner or loser.
*/

function gameOverMessage(who) {
    document.querySelector(".gameover").style.display = "block";
    document.querySelector(".gameover #text").innerText = who;
}

/* 
    This function checks whenever all the cells are full then changes 
    all the cells to certain color putting a game over message as well.
    If there is no tie the fuction returns false.
*/

function checkTie() {
    if (emptyCells().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "gray";
            cells[i].removeEventListener('click', changeTurn, false);
        }
        gameOverMessage("Tie Game!")
        return true;
    }
    return false;
}

/* 
    This function returns a array containing the indices of empty cells 
    left on the game board. The AI will use this as well as the next couple
    functions to see which is the best empty cells to choose next.
*/

function emptyCells() {
    return gameBoard.filter(s => typeof s == 'number');
}

/* 
    This function returns a array containing the indices of empty cells 
    left on the game board. The AI will use this as well as the next couple
    functions to see which is the best empty cells to choose next.
*/

function bestSpot() {
    return minimax(gameBoard, aiPlayer).index;
}

/* 
    availSpots = updates with the new indicies of the empty cells.
    moves - is a variable 

    This function is called minmax because it replicated a machine learning 
    algorthim that evaluates all possible moves to determine the most optimal
    move for the rest of the game. This function predicts the best possible
    moves while even considering the opponent making the game unbeatable.

    Minimax basically works using recursion and optimization.
*/

function minimax(newBoard, player){
    var availSpots = emptyCells(newBoard);

    if (winChecker(newBoard, player)) {
        return {
            score: -10
        };
    } else if (winChecker(newBoard, aiPlayer)) {
        return {
            score: 10
        };
    } else if (availSpots.length === 0) {
        return {
            score: 0
        };
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = gameBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) { 
            var results = minimax(gameBoard, humanPlayer);
            move.score = results.score; 
        } else {
            var results = minimax(gameBoard, aiPlayer);
            move.score = results.score; 
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move)
    }
    var bestMove;
    if(player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}