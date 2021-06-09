/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player (1 or 2)

let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 *    board = WIDTH # of arrays each containing HEIGHT number of cells
 */

function makeBoard() {
  for (let i = 0; i < WIDTH; i++) {
    let newArray = [];
    for (let n = 0; n < HEIGHT; n++) {
      newArray.push(null);
    }
    board.push(newArray);
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');

  // Create click zone to drop pieces
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    // give id of x axis position
    headCell.setAttribute('id', x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create the game board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      // give id of y-x axis positions for each tile
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  if (board[x][0] !== null) {
    return null;
  } else {
    return board[x].lastIndexOf(null);
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // create game piece
  const newTile = document.createElement('div');
  newTile.classList.add('piece');
  if (currPlayer === 1) {
    newTile.classList.add('p1');
  } else {
    newTile.classList.add('p2');
  }
  // update HTML board
  const placeInBoard = document.getElementById(`${y}-${x}`);
  placeInBoard.append(newTile);
}

/** endGame: announce game end */

function endGame(msg) {
  // blur board
  const selectBG = document.querySelector('table');
  selectBG.classList.add('endgame');

  // create game-over div
  const gameOverDiv = document.createElement('div');
  gameOverDiv.classList.add('endgame-message', 'tracking-in-expand');
  document.body.append(gameOverDiv);

  // create winner/tie text
  const gameOverText = document.createElement('h1');
  gameOverText.textContent = msg;
  gameOverText.classList.add('endgame-text', 'tracking-in-expand');
  gameOverDiv.append(gameOverText);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // update in-memory board
  for (let i = WIDTH; i >= 0; i--) {
    if (board[x][i] === null) {
      board[x][i] = currPlayer;
      break;
    }
  }

  // check for win
  if (checkForWin()) {
    return endGame(`🏆  Player ${currPlayer} won!  🏆`);
  }

  // check for tie
  if (board.every((arr) => arr.every((val) => val))) {
    return endGame("It's a Tie!");
  }

  // switch players
  currPlayer === 1 ? currPlayer++ : currPlayer--;
}

/* checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    // SWAPPED WIDTH AND HEIGHT BELOW
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < WIDTH &&
        x >= 0 &&
        x < HEIGHT &&
        board[y][x] === currPlayer
    );
  }

  // SWAPPED WIDTH AND HEIGHT BELOW
  // Check for four in a row
  for (let y = 0; y < WIDTH; y++) {
    for (let x = 0; x < HEIGHT; x++) {
      // horizontal win
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      // vertical win
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      // diagonal right win
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      // diagonal left win
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
