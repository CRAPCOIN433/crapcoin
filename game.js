class CrapGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.lastTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        this.resetGame();
        this.bindEvents();
    }

    resetGame() {
        this.score = 0;
        this.gameOver = false;
        this.player = {
            y: this.canvas.height - 80, // Position player on "ground"
            velocity: 0,
            isJumping: false,
            width: 40,
            height: 40
        };
        this.groundY = this.canvas.height - 40; // Define ground level
        this.obstacles = [];
        this.gameSpeed = 5;
        this.nextObstacleSpawn = 0;
        this.obstacleTypes = [
            { width: 40, height: 60 },
            { width: 60, height: 40 }
        ];
    }

    bindEvents() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !this.player.isJumping) {
                this.jump();
            }
        });

        // Touch controls
        this.canvas.addEventListener('touchstart', () => {
            if (!this.player.isJumping) {
                this.jump();
            }
        });
    }

    jump() {
        if (!this.player.isJumping && !this.gameOver) {
            this.player.isJumping = true;
            this.player.velocity = -12;
            playSound('click');
        }
    }

    update(deltaTime) {
        if (this.gameOver) return;

        // Player physics
        if (this.player.isJumping) {
            this.player.y += this.player.velocity;
            this.player.velocity += 0.5; // gravity

            // Ground collision
            if (this.player.y >= this.groundY) {
                this.player.y = this.groundY;
                this.player.velocity = 0;
                this.player.isJumping = false;
            }
        }

        // Spawn obstacles with time-based check
        this.nextObstacleSpawn -= deltaTime;
        if (this.nextObstacleSpawn <= 0) {
            const obstacleType = this.obstacleTypes[Math.floor(Math.random() * this.obstacleTypes.length)];
            this.obstacles.push({
                x: this.canvas.width,
                width: obstacleType.width,
                height: obstacleType.height
            });
            this.nextObstacleSpawn = 2000; // Fixed 2 second interval for better gameplay
        }

        // Update obstacles with improved collision
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.x -= this.gameSpeed;

            if (this.checkCollision(this.player, obs)) {
                this.endGame();
                return;
            }

            if (obs.x + obs.width < 0) {
                this.obstacles.splice(i, 1);
                this.score++;
                if (this.score % 10 === 0) {
                    this.earnCrap();
                }
            }
        }
    }

    checkCollision(player, obstacle) {
        return (
            30 + player.width > obstacle.x &&
            30 < obstacle.x + obstacle.width &&
            player.y + player.height > this.canvas.height - obstacle.height
        );
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ground line
        this.ctx.strokeStyle = '#ffb700';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - 40);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - 40);
        this.ctx.stroke();

        // Draw player
        this.ctx.fillStyle = '#ffb700';
        this.ctx.fillRect(30, this.player.y, this.player.width, this.player.height);

        // Draw all obstacles in one pass
        this.ctx.fillStyle = '#ff6b00';
        for (const obs of this.obstacles) {
            this.ctx.fillRect(
                obs.x, 
                this.canvas.height - obs.height, 
                obs.width, 
                obs.height
            );
        }

        // Draw score
        this.ctx.font = '20px Pricedown';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }

    gameLoop(timestamp) {
        if (this.lastTime === 0) {
            this.lastTime = timestamp;
        }
        const deltaTime = timestamp - this.lastTime;

        if (deltaTime >= this.frameInterval) {
            this.update(deltaTime);
            this.draw();
            this.lastTime = timestamp;
        }

        if (!this.gameOver) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    earnCrap() {
        let currentCrap = parseInt(localStorage.getItem('crapBalance') || '0');
        localStorage.setItem('crapBalance', (currentCrap + 1).toString());
        showMissionPassed();
    }

    endGame() {
        this.gameOver = true;
        playSound('mission');
        this.ctx.font = '40px Pricedown';
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillText('WASTED', this.canvas.width/2 - 70, this.canvas.height/2);
    }

    start() {
        this.resetGame();
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Game initialization
function startGame() {
    const game = new CrapGame();
    game.start();
}
