/**
 * AI.js - Minimax Algorithm Implementation for Tic-Tac-Toe
 * Provides optimal AI opponent using Minimax with Alpha-Beta Pruning
 * 
 * @author Abdessamad Guiadiri
 * @copyright © 2025 Abdessamad Guiadiri. All rights reserved.
 * @email abdessamadguia11@gmail.com
 * @phone +212 778-9463
 * @portfolio https://portfolio-v2-2-ten.vercel.app/
 * @github https://github.com/abdessamad159
 */

class TicTacToeAI {
    constructor(aiPlayer = 'O', humanPlayer = 'X') {
        this.aiPlayer = aiPlayer;
        this.humanPlayer = humanPlayer;
    }

    /**
     * Get the best move for AI using Minimax algorithm
     * @param {Array} board - Current game board state
     * @returns {number} - Best move index (0-8)
     */
    getBestMove(board) {
        let bestScore = -Infinity;
        let bestMove = -1;

        // Try each empty cell
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                // Make the move
                board[i] = this.aiPlayer;
                
                // Calculate score using minimax
                let score = this.minimax(board, 0, false, -Infinity, Infinity);
                
                // Undo the move
                board[i] = '';
                
                // Update best move if this is better
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    /**
     * Minimax algorithm with Alpha-Beta Pruning
     * @param {Array} board - Current board state
     * @param {number} depth - Current depth in game tree
     * @param {boolean} isMaximizing - Whether this is maximizing player's turn
     * @param {number} alpha - Alpha value for pruning
     * @param {number} beta - Beta value for pruning
     * @returns {number} - Score of the position
     */
    minimax(board, depth, isMaximizing, alpha, beta) {
        // Check for terminal states
        const result = this.checkWinner(board);
        
        if (result !== null) {
            if (result === this.aiPlayer) {
                return 10 - depth; // Prefer quicker wins
            } else if (result === this.humanPlayer) {
                return depth - 10; // Prefer slower losses
            } else {
                return 0; // Draw
            }
        }

        if (isMaximizing) {
            // AI's turn (maximizing)
            let maxScore = -Infinity;
            
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.aiPlayer;
                    let score = this.minimax(board, depth + 1, false, alpha, beta);
                    board[i] = '';
                    
                    maxScore = Math.max(score, maxScore);
                    alpha = Math.max(alpha, score);
                    
                    // Alpha-Beta Pruning
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            
            return maxScore;
        } else {
            // Human's turn (minimizing)
            let minScore = Infinity;
            
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.humanPlayer;
                    let score = this.minimax(board, depth + 1, true, alpha, beta);
                    board[i] = '';
                    
                    minScore = Math.min(score, minScore);
                    beta = Math.min(beta, score);
                    
                    // Alpha-Beta Pruning
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            
            return minScore;
        }
    }

    /**
     * Check if there's a winner or draw
     * @param {Array} board - Current board state
     * @returns {string|null} - Winner ('X' or 'O'), 'draw', or null
     */
    checkWinner(board) {
        // All possible winning combinations
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

        // Check each winning pattern
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // Return winner
            }
        }

        // Check for draw (board full)
        if (board.every(cell => cell !== '')) {
            return 'draw';
        }

        // Game still in progress
        return null;
    }

    /**
     * Get a random move (for easier difficulty - not used in current implementation)
     * @param {Array} board - Current board state
     * @returns {number} - Random empty cell index
     */
    getRandomMove(board) {
        const emptyCells = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                emptyCells.push(i);
            }
        }
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    /**
     * Get a medium difficulty move (blocks wins, takes wins, otherwise random)
     * @param {Array} board - Current board state
     * @returns {number} - Move index
     */
    getMediumMove(board) {
        // Check if AI can win
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = this.aiPlayer;
                if (this.checkWinner(board) === this.aiPlayer) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }

        // Check if need to block human
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = this.humanPlayer;
                if (this.checkWinner(board) === this.humanPlayer) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }

        // Otherwise, random move
        return this.getRandomMove(board);
    }
}
