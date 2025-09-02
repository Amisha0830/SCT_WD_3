
        class TicTacToe {
            constructor() {
                this.board = Array(9).fill('');
                this.currentPlayer = 'X';
                this.gameActive = true;
                this.gameMode = 'pvp'; // 'pvp' or 'pvc'
                this.scores = { x: 0, o: 0, draws: 0 };
                
                this.winningConditions = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                    [0, 4, 8], [2, 4, 6] // diagonals
                ];

                this.initializeGame();
                this.loadScores();
            }

            initializeGame() {
                this.cells = document.querySelectorAll('.cell');
                this.gameStatus = document.getElementById('game-status');
                this.currentPlayerDisplay = document.getElementById('current-player');
                this.resetButton = document.getElementById('reset-game');
                this.resetScoresButton = document.getElementById('reset-scores');
                this.pvpModeButton = document.getElementById('pvp-mode');
                this.pvcModeButton = document.getElementById('pvc-mode');

                this.cells.forEach(cell => {
                    cell.addEventListener('click', this.handleCellClick.bind(this));
                });

                this.resetButton.addEventListener('click', this.resetGame.bind(this));
                this.resetScoresButton.addEventListener('click', this.resetScores.bind(this));
                this.pvpModeButton.addEventListener('click', () => this.setGameMode('pvp'));
                this.pvcModeButton.addEventListener('click', () => this.setGameMode('pvc'));

                this.updateDisplay();
            }

            setGameMode(mode) {
                this.gameMode = mode;
                this.pvpModeButton.classList.toggle('active', mode === 'pvp');
                this.pvcModeButton.classList.toggle('active', mode === 'pvc');
                this.resetGame();
            }

            handleCellClick(e) {
                const cellIndex = parseInt(e.target.getAttribute('data-index'));
                
                if (this.board[cellIndex] !== '' || !this.gameActive) {
                    return;
                }

                this.makeMove(cellIndex);
            }

            makeMove(cellIndex) {
                this.board[cellIndex] = this.currentPlayer;
                this.updateCellDisplay(cellIndex);
                
                if (this.checkWinner()) {
                    this.handleGameEnd('win');
                } else if (this.isDraw()) {
                    this.handleGameEnd('draw');
                } else {
                    this.switchPlayer();
                    if (this.gameMode === 'pvc' && this.currentPlayer === 'O') {
                        setTimeout(() => this.makeComputerMove(), 500);
                    }
                }
            }

            makeComputerMove() {
                if (!this.gameActive) return;

                // Simple AI: Try to win, block player from winning, or make random move
                let bestMove = this.findBestMove();
                this.makeMove(bestMove);
            }

            findBestMove() {
                // Try to win
                for (let i = 0; i < 9; i++) {
                    if (this.board[i] === '') {
                        this.board[i] = 'O';
                        if (this.checkWinner()) {
                            this.board[i] = '';
                            return i;
                        }
                        this.board[i] = '';
                    }
                }

                // Try to block player from winning
                for (let i = 0; i < 9; i++) {
                    if (this.board[i] === '') {
                        this.board[i] = 'X';
                        if (this.checkWinner()) {
                            this.board[i] = '';
                            return i;
                        }
                        this.board[i] = '';
                    }
                }

                // Take center if available
                if (this.board[4] === '') return 4;

                // Take corners
                const corners = [0, 2, 6, 8];
                const availableCorners = corners.filter(i => this.board[i] === '');
                if (availableCorners.length > 0) {
                    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
                }

                // Take any available space
                const availableMoves = this.board.map((cell, index) => cell === '' ? index : null)
                                                .filter(val => val !== null);
                return availableMoves[Math.floor(Math.random() * availableMoves.length)];
            }

            switchPlayer() {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                this.updateDisplay();
            }

            checkWinner() {
                for (let condition of this.winningConditions) {
                    const [a, b, c] = condition;
                    if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                        this.highlightWinningCells(condition);
                        return true;
                    }
                }
                return false;
            }

            highlightWinningCells(winningCondition) {
                winningCondition.forEach(index => {
                    this.cells[index].classList.add('winning-cell');
                });
            }

            isDraw() {
                return this.board.every(cell => cell !== '');
            }

            handleGameEnd(result) {
                this.gameActive = false;
                
                if (result === 'win') {
                    this.scores[this.currentPlayer.toLowerCase()]++;
                    this.gameStatus.textContent = `🎉 Player ${this.currentPlayer} Wins!`;
                    this.gameStatus.className = 'game-status status-win';
                } else {
                    this.scores.draws++;
                    this.gameStatus.textContent = `🤝 It's a Draw!`;
                    this.gameStatus.className = 'game-status status-draw';
                }
                
                this.updateScoreDisplay();
                this.saveScores();
                
                this.cells.forEach(cell => cell.disabled = true);
            }

            updateCellDisplay(index) {
                const cell = this.cells[index];
                cell.textContent = this.currentPlayer;
                cell.classList.add(this.currentPlayer.toLowerCase());
                cell.disabled = true;
            }

            updateDisplay() {
                if (this.gameActive) {
                    this.currentPlayerDisplay.textContent = `Current Player: ${this.currentPlayer}`;
                    this.gameStatus.textContent = `Player ${this.currentPlayer}'s turn`;
                    this.gameStatus.className = 'game-status status-playing';
                }
            }

            updateScoreDisplay() {
                document.getElementById('x-score').textContent = this.scores.x;
                document.getElementById('o-score').textContent = this.scores.o;
                document.getElementById('draws').textContent = this.scores.draws;
            }

            resetGame() {
                this.board = Array(9).fill('');
                this.currentPlayer = 'X';
                this.gameActive = true;
                
                this.cells.forEach(cell => {
                    cell.textContent = '';
                    cell.disabled = false;
                    cell.className = 'cell';
                });
                
                this.updateDisplay();
            }

            resetScores() {
                this.scores = { x: 0, o: 0, draws: 0 };
                this.updateScoreDisplay();
                this.saveScores();
            }

            saveScores() {
                // Note: In a real environment, you would use localStorage here
                // For this artifact, scores reset when page refreshes
            }

            loadScores() {
                // Note: In a real environment, you would load from localStorage here
                this.updateScoreDisplay();
            }
        }

        // Initialize the game when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new TicTacToe();
        });
    