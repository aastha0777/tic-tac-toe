const board = document.getElementById("board");
const statusText = document.getElementById("status");
const winLine = document.getElementById("win-line");

let currentPlayer = "X";
let cells = [];
let gameOver = false;
let round = 1;
let maxRounds = 5;

function createBoard() {
  board.innerHTML = '';
  cells = Array(9).fill("");
  gameOver = false;
  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  // Reset win line
  winLine.classList.remove("active");
  winLine.style.top = "0px";
  winLine.style.left = "0px";
  winLine.style.transform = "scaleX(0) rotate(0deg)";
  winLine.style.opacity = "0";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleMove, { once: true });
    board.appendChild(cell);
  }
}

function handleMove(e) {
  const cell = e.target;
  const index = cell.dataset.index;

  if (gameOver || cells[index]) return;

  cells[index] = currentPlayer;
  cell.classList.add(currentPlayer === "X" ? "pink" : "grey");
  cell.textContent = currentPlayer;

  const winResult = checkWin(currentPlayer);
  if (winResult !== null) {
    showWinLine(winResult.index);
    highlightWinningCells(winResult.cells);
    statusText.textContent = `Player ${currentPlayer} Wins Round ${round}! 🎉`;
    gameOver = true;
    return;
  }

  if (cells.every(cell => cell)) {
    statusText.textContent = `Round ${round} is a Draw.`;
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWin(player) {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];

  for (let i = 0; i < winCombos.length; i++) {
    const [a, b, c] = winCombos[i];
    if (cells[a] === player && cells[b] === player && cells[c] === player) {
      return { index: i, cells: [a, b, c] };
    }
  }

  return null;
}

function showWinLine(index) {
  const positions = [
    { top: "60px", left: "0px", rotate: "0deg" },     // Row 1
    { top: "180px", left: "0px", rotate: "0deg" },    // Row 2
    { top: "300px", left: "0px", rotate: "0deg" },    // Row 3
    { top: "0px", left: "60px", rotate: "90deg" },    // Col 1
    { top: "0px", left: "180px", rotate: "90deg" },   // Col 2
    { top: "0px", left: "300px", rotate: "90deg" },   // Col 3
    { top: "0px", left: "0px", rotate: "45deg" },     // Diagonal \
    { top: "0px", left: "0px", rotate: "-45deg" }     // Diagonal /
  ];

  const pos = positions[index];
  winLine.style.top = pos.top;
  winLine.style.left = pos.left;
  winLine.style.transform = `scaleX(1) rotate(${pos.rotate})`;
  winLine.classList.add("active");
}

function highlightWinningCells(cellIndexes) {
  const allCells = document.querySelectorAll(".cell");
  cellIndexes.forEach(i => {
    allCells[i].classList.add("winner");
  });
}

function resetGame() {
  if (round <= maxRounds) {
    round++;
    createBoard();
  } else {
    statusText.textContent = "Match Over. Start a New Match!";
  }
}

function resetMatch() {
  round = 1;
  createBoard();
}

// Start game
createBoard();
