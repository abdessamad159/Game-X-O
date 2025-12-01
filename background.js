/**
 * Background Animation - Simple Falling Stars
 * Lightweight and smooth falling stars animation
 * 
 * @author Abdessamad Guiadiri
 * @copyright © 2025 Abdessamad Guiadiri. All rights reserved.
 */

class Star {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.y = Math.random() * canvas.height; // Start at random position
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -10;
        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.7 + 0.3;
        
        // Simple color variation
        const brightness = Math.floor(Math.random() * 100 + 155);
        this.color = `${brightness}, ${brightness}, ${brightness + 50}`;
    }

    update() {
        this.y += this.speed;
        
        if (this.y > this.canvas.height + 10) {
            this.reset();
        }
    }

    draw(ctx) {
        // Simple star with glow
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Small glow
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class StarryBackground {
    constructor() {
        this.canvas = document.getElementById('backgroundCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.starCount = 50; // Reduced for better performance
        this.explosionStars = [];
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }

    init() {
        this.resizeCanvas();
        this.stars = [];
        
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push(new Star(this.canvas));
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleResize() {
        this.resizeCanvas();
    }

    triggerExplosion() {
        // Create explosion stars
        for (let i = 0; i < 30; i++) {
            this.explosionStars.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 3,
                size: Math.random() * 3 + 1,
                life: 1,
                color: `255, ${Math.floor(Math.random() * 100 + 155)}, 0`
            });
        }
    }

    animate() {
        // Clear with slight trail
        this.ctx.fillStyle = 'rgba(15, 12, 41, 0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw normal stars
        this.stars.forEach(star => {
            star.update();
            star.draw(this.ctx);
        });

        // Draw and update explosion stars
        this.explosionStars = this.explosionStars.filter(star => {
            star.vy += 0.2; // Gravity
            star.x += star.vx;
            star.y += star.vy;
            star.life -= 0.02;
            
            if (star.life > 0) {
                this.ctx.fillStyle = `rgba(${star.color}, ${star.life})`;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
                return true;
            }
            return false;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Global instance
let starryBackground;

document.addEventListener('DOMContentLoaded', () => {
    starryBackground = new StarryBackground();
});

window.triggerStarExplosion = function() {
    if (starryBackground) {
        starryBackground.triggerExplosion();
    }
};
