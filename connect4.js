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

let hoverX = 0; // id to store for displaying and removing tile preview

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
  top.addEventListener('mouseover', hoverPreview);
  top.addEventListener('mouseout', hoverPreviewRemove);
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
  newTile.classList.add('piece', 'bounce-in-top', `p${currPlayer}`);
  newTile.setAttribute('id', 'game-piece');

  // update HTML boardx`
  const placeInBoard = document.getElementById(`${y}-${x}`);
  placeInBoard.append(newTile);
}

/** endGame: announce game end */

function endGame(msg) {
  // remove game-board event listeners
  topRow = document.getElementById('column-top');
  topRow.removeEventListener('click', handleClick);
  topRow.removeEventListener('mouseover', hoverPreview);

  // create game-over div
  const gameOverDiv = document.createElement('div');
  gameOverDiv.classList.add('endgame-message', 'tracking-in-expand');

  // create winner/tie text
  const gameOverText = document.createElement('h1');
  gameOverText.textContent = msg;
  gameOverText.classList.add('endgame-text', 'tracking-in-expand');

  // create new-game div
  const newGameDiv = document.createElement('div');
  newGameDiv.classList.add('newgame-message', 'tracking-in-expand');
  newGameDiv.addEventListener('click', resetGame);
  // mouse hover
  newGameDiv.addEventListener('mouseover', function () {
    newGameDiv.classList.remove('scale-down-left');
    newGameDiv.classList.add('scale-up-left');
  });

  // // create new-game text
  const newGameText = document.createElement('h1');
  newGameText.textContent = 'New Game';
  newGameText.classList.add('newgame-text', 'tracking-in-expand');
  newGameText.addEventListener('click', resetGame);
  // mouse hover remove
  newGameDiv.addEventListener('mouseout', function () {
    newGameDiv.classList.remove('scale-up-left');
    newGameDiv.classList.add('scale-down-left');
  });

  // append message and blur board on Timeout
  setTimeout(function () {
    // blur board
    const selectBG = document.querySelector('table');
    selectBG.classList.add('endgame');
    // append message
    document.body.append(gameOverDiv);
    gameOverDiv.append(gameOverText);
    gameOverDiv.append(newGameDiv);
    newGameDiv.append(newGameText);
  }, 800);
}

/** preview:  */

function hoverPreview(e) {
  // get x from hovered cell
  const x = e.target.id;
  hoverX = x;

  // get next spot in column
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // create game piece
  const newTile = document.createElement('div');
  newTile.classList.add('piece', `p${currPlayer}-hover`);
  newTile.setAttribute('id', 'ghost-piece');
  // update HTML boardx`
  const placeInBoard = document.getElementById(`${y}-${x}`);
  placeInBoard.append(newTile);
}

/** previewRemove:  */

function hoverPreviewRemove(e) {
  // get x from hovered cell
  const x = hoverX;

  // get next spot in column
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // remove piece
  const pieceToRemove = document.getElementById('ghost-piece');
  pieceToRemove.remove();
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from clicked cell
  const x = evt.target.id;

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
    return endGame(`🏆  Player ${currPlayer} wins!  🏆`);
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

function resetGame() {
  // remove end-game messages
  const endgameMessage = document.querySelector('.endgame-message');
  endgameMessage.remove();

  // remove blur
  const selectBG = document.querySelector('table');
  selectBG.classList.remove('endgame');

  // remove game pieces
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const eachCell = document.getElementById(`${y}-${x}`);
      eachCell.innerHTML = '';
    }
  }

  // init values
  board = [];
  currPlayer = 1;

  makeBoard();
  top.addEventListener('click', handleClick);
}

makeBoard();
makeHtmlBoard();
