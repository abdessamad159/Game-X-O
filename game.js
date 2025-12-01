/**
 * Game.js - Main Game Logic for Tic-Tac-Toe
 * Handles game state, UI updates, and player interactions
 * 
 * @author Abdessamad Guiadiri
 * @copyright © 2025 Abdessamad Guiadiri. All rights reserved.
 * @email abdessamadguia11@gmail.com
 * @phone +212 778-9463
 * @portfolio https://portfolio-v2-2-ten.vercel.app/
 * @github https://github.com/abdessamad159
 */

// Game State
const gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameMode: 'ai', // 'ai' or '2p'
    scores: {
        X: 0,
        O: 0,
        draws: 0
    },
    winningLine: null,
    moveHistory: [], // Track move order for infinite gameplay
    maxMoves: 9, // Maximum moves before removing oldest
    isProcessing: false // Prevent multiple simultaneous moves
};

// Winning combinations
const winPatterns = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal \
    [2, 4, 6]  // Diagonal /
];

// DOM Elements
const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const gameStatusDisplay = document.getElementById('gameStatus');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const scoreDrawsDisplay = document.getElementById('scoreDraws');
const newGameBtn = document.getElementById('newGameBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const aiModeBtn = document.getElementById('aiModeBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const winLineSvg = document.getElementById('winLine');

// AI Instance
let ai = new TicTacToeAI('O', 'X');

// Initialize game
function init() {
    loadScores();
    updateScoreDisplay();
    updateCurrentPlayerDisplay();
    attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    newGameBtn.addEventListener('click', resetGame);
    resetScoreBtn.addEventListener('click', resetScores);
    aiModeBtn.addEventListener('click', () => setGameMode('ai'));
    twoPlayerBtn.addEventListener('click', () => setGameMode('2p'));
}

// Handle cell click
function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));
    
    // Prevent multiple simultaneous moves
    if (gameState.isProcessing) {
        return;
    }
    
    // Validate move - only check if cell is empty
    if (gameState.board[index] !== '') {
        return;
    }
    
    // Don't allow clicks during AI turn
    if (gameState.gameMode === 'ai' && gameState.currentPlayer === 'O') {
        return;
    }
    
    // Make player move
    makeMove(index);
    
    // Check if player won
    if (checkGameStatus()) {
        return; // Game ended, but can continue after reset
    }
    
    // AI turn in AI mode
    if (gameState.gameMode === 'ai' && gameState.currentPlayer === 'O') {
        gameState.isProcessing = true;
        setTimeout(() => {
            const aiMove = ai.getBestMove(gameState.board);
            if (aiMove !== -1 && gameState.board[aiMove] === '') {
                makeMove(aiMove);
                checkGameStatus();
            }
            gameState.isProcessing = false;
        }, 300);
    }
}

// Make a move
function makeMove(index) {
    // Check if board is full (9 moves made)
    if (gameState.moveHistory.length >= gameState.maxMoves) {
        // Remove the oldest move
        const oldestMove = gameState.moveHistory.shift();
        gameState.board[oldestMove.index] = '';
        
        // Update UI - remove from oldest cell with fade out animation
        const oldCell = cells[oldestMove.index];
        oldCell.classList.remove('oldest'); // Remove warning indicator
        oldCell.style.opacity = '0.3';
        
        // Use a shorter timeout to avoid blocking AI
        setTimeout(() => {
            oldCell.textContent = '';
            oldCell.classList.remove('filled', 'x', 'o');
            oldCell.style.opacity = '1';
        }, 150);
    }
    
    // Update board state
    gameState.board[index] = gameState.currentPlayer;
    
    // Track this move
    gameState.moveHistory.push({
        index: index,
        player: gameState.currentPlayer
    });
    
    // Update UI
    const cell = cells[index];
    cell.textContent = gameState.currentPlayer;
    cell.classList.add('filled', gameState.currentPlayer.toLowerCase());
    
    // Highlight oldest move if board is getting full (8+ moves)
    updateOldestMoveIndicator();
    
    // Switch player
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    updateCurrentPlayerDisplay();
}

// Update oldest move indicator
function updateOldestMoveIndicator() {
    // Remove all oldest indicators
    cells.forEach(cell => cell.classList.remove('oldest'));
    
    // If we have 8+ moves, highlight the oldest one
    if (gameState.moveHistory.length >= 8) {
        const oldestIndex = gameState.moveHistory[0].index;
        cells[oldestIndex].classList.add('oldest');
    }
}

// Check game status (win only - no draws in infinite mode)
function checkGameStatus() {
    // Check for winner
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameState.board[a] && 
            gameState.board[a] === gameState.board[b] && 
            gameState.board[a] === gameState.board[c]) {
            
            // Winner found
            handleWin(gameState.board[a], pattern);
            return true; // Return true to indicate game ended
        }
    }
    
    // No draw check - game continues infinitely until someone wins!
    return false; // Game continues
}

// Handle win
function handleWin(winner, pattern) {
    gameState.gameActive = false;
    gameState.winningLine = pattern;
    
    // Trigger star explosion effect
    if (window.triggerStarExplosion) {
        window.triggerStarExplosion();
    }
    
    // Update score
    gameState.scores[winner]++;
    saveScores();
    updateScoreDisplay();
    
    // Highlight winning cells
    pattern.forEach(index => {
        cells[index].classList.add('winning');
    });
    
    // Draw win line
    drawWinLine(pattern);
    
    // Display winner message
    const winnerLabel = gameState.gameMode === 'ai' && winner === 'O' ? 'الكمبيوتر' : `اللاعب ${winner}`;
    displayStatus(`🎉 ${winnerLabel} فاز!`, 'winner');
}

// Handle draw
function handleDraw() {
    gameState.gameActive = false;
    
    // Update score
    gameState.scores.draws++;
    saveScores();
    updateScoreDisplay();
    
    // Display draw message
    displayStatus('🤝 تعادل!', 'draw');
}

// Draw win line
function drawWinLine(pattern) {
    const boardRect = document.getElementById('gameBoard').getBoundingClientRect();
    const firstCell = cells[pattern[0]].getBoundingClientRect();
    const lastCell = cells[pattern[2]].getBoundingClientRect();
    
    // Calculate line coordinates relative to board
    const x1 = firstCell.left + firstCell.width / 2 - boardRect.left;
    const y1 = firstCell.top + firstCell.height / 2 - boardRect.top;
    const x2 = lastCell.left + lastCell.width / 2 - boardRect.left;
    const y2 = lastCell.top + lastCell.height / 2 - boardRect.top;
    
    // Set line attributes
    winLineSvg.setAttribute('x1', x1);
    winLineSvg.setAttribute('y1', y1);
    winLineSvg.setAttribute('x2', x2);
    winLineSvg.setAttribute('y2', y2);
    winLineSvg.classList.add('show');
}

// Display status message
function displayStatus(message, type) {
    gameStatusDisplay.innerHTML = `<div class="status-message ${type}">${message}</div>`;
}

// Update current player display
function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.textContent = gameState.currentPlayer;
    currentPlayerDisplay.className = 'current-player';
    currentPlayerDisplay.classList.add(`player-${gameState.currentPlayer.toLowerCase()}`);
}

// Update score display
function updateScoreDisplay() {
    scoreXDisplay.textContent = gameState.scores.X;
    scoreODisplay.textContent = gameState.scores.O;
    scoreDrawsDisplay.textContent = gameState.scores.draws;
}

// Reset game (new game)
function resetGame() {
    // Reset board state
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.currentPlayer = 'X';
    gameState.gameActive = true;
    gameState.winningLine = null;
    gameState.moveHistory = []; // Clear move history
    
    // Clear UI
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
        cell.style.opacity = '1'; // Reset opacity
    });
    
    // Clear status
    gameStatusDisplay.innerHTML = '';
    
    // Hide win line
    winLineSvg.classList.remove('show');
    
    // Update display
    updateCurrentPlayerDisplay();
}

// Reset scores
function resetScores() {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع النتائج؟')) {
        gameState.scores = {
            X: 0,
            O: 0,
            draws: 0
        };
        saveScores();
        updateScoreDisplay();
    }
}

// Set game mode
function setGameMode(mode) {
    gameState.gameMode = mode;
    
    // Update UI
    if (mode === 'ai') {
        aiModeBtn.classList.add('active');
        twoPlayerBtn.classList.remove('active');
    } else {
        twoPlayerBtn.classList.add('active');
        aiModeBtn.classList.remove('active');
    }
    
    // Reset game when mode changes
    resetGame();
}

// Save scores to localStorage
function saveScores() {
    localStorage.setItem('xoGameScores', JSON.stringify(gameState.scores));
}

// Load scores from localStorage
function loadScores() {
    const savedScores = localStorage.getItem('xoGameScores');
    if (savedScores) {
        gameState.scores = JSON.parse(savedScores);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
