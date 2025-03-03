const canvas = document.getElementById("chessBoard");
const ctx = canvas.getContext("2d");

const BOARD_RADIUS = 200;
const RANKS = 2;
const FILES = 12;

// Convert board position to screen coordinates
function polarToCartesian(rank, file) {
    let r = ((rank + 1) / RANKS) * BOARD_RADIUS;
    let theta = (file / FILES) * 2 * Math.PI;
    
    let x = canvas.width / 2 + r * Math.cos(theta);
    let y = canvas.height / 2 + r * Math.sin(theta);
    
    return { x, y };
}

// Draw the board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circles (rings)
    for (let i = 1; i <= RANKS; i++) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, (i / RANKS) * BOARD_RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // Draw radial lines (files)
    for (let i = 0; i < FILES; i++) {
        let theta = (i / FILES) * 2 * Math.PI;
        let x = canvas.width / 2 + BOARD_RADIUS * Math.cos(theta);
        let y = canvas.height / 2 + BOARD_RADIUS * Math.sin(theta);
        
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

// Draw pieces
function drawPiece(rank, file, color) {
    let { x, y } = polarToCartesian(rank, file);

    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

// Example setup
board[0][3] = "P"; // Outer ring, file 3
board[1][6] = "R"; // Inner ring, file 6

// Render board
drawBoard();
drawPiece(0, 3, "black");
drawPiece(1, 6, "white");
