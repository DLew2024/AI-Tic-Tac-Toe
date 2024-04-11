/* 
    6 steps
    1. Set up game regularly
    2. Find winner
    3. Win Message
    4. Minimax message
    5. AI communication
    6. Game Restart (Loop back to 2)
*/

var board;
const humanPlayer = 'X';
const aiPlayer = 'O';
const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [1, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

const cells = document.querySelectorAll('.cell');

restartGame();

function restartGame() {
    document.querySelector(".gameover").style.display = "none";
    board = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', printClick, false);
    }
}   

function printClick(square) {
    console.log(square.target.id);
}