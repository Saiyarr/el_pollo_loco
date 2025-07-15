class World {
    character = new Character();
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    lastHit = 0;
    hitCooldown = 500;
    statusBar = new StatusBar();
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    statusBarEndboss = new StatusBarEndboss();
    throwableObjects = [];

    /**
     * Initializes the game world, character, input, level, and starts the game loop.
     * @param {HTMLCanvasElement} canvas - The canvas element to render on.
     * @param {Object} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level1;
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Connects world context to character and all enemies.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            if (typeof enemy.setWorld === 'function') {
                enemy.setWorld(this);
            }
        });
    }

    /**
     * Starts repeating tasks like collision checks and object throwing.
     */
    run() {
        setInterval(() => {
            this.checkCoinCollision();
            this.checkBottleCollision();
            this.checkThrowObjects();
        }, 200);

        setInterval(() => {
            this.checkCollisions();
        }, 50);
    }

    /**
     * Checks if the player can throw a bottle and does so if possible.
     */
    checkThrowObjects() {
        if (this.keyboard.D && this.statusBarBottle.collectedBottles > 0) {
            let bottle = new ThrowableObject(this.character.x, this.character.y + 100, this);
            this.throwableObjects.push(bottle);
            this.statusBarBottle.count(this.statusBarBottle.collectedBottles - 1);
        }
    }

    /**
     * Checks for collisions between the character and coins, and updates UI and sound.
     */
    checkCoinCollision() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.statusBarCoin.setPercentage(this.statusBarCoin.percentageCoin + 20);
                coinSound.currentTime = 0;
                coinSound.play();
            }
        });
    }

    /**
     * Checks for collisions between the character and bottles, updates inventory and sound.
     */
    checkBottleCollision() {
        this.level.tabascoBottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.tabascoBottles.splice(index, 1);
                this.statusBarBottle.count(this.statusBarBottle.collectedBottles + 1);
                bottleCollectSound.currentTime = 0;
                bottleCollectSound.play();
            }
        });
    }

    /**
     * Handles character collision with enemies, applying damage or killing enemy on jump.
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (!this.character.isAboveGround()) {
                if (this.character.isColliding(enemy)) {
                    let currentTime = new Date().getTime();
                    if (currentTime - this.lastHit > this.hitCooldown) {
                        this.character.hit();
                        this.statusBar.setPercentage(this.character.energy);
                        this.lastHit = currentTime;
                    }
                }
            } else if (this.character.isJumpingOnEnemy(enemy) && !(enemy instanceof BossChicken)) {
                enemy.replaceWithDeadEnemy();
            }
        });
    }

    /**
     * Main draw loop that renders the background, game objects, and UI.
     */
    draw() {
        if (!world) return;
        this.clearCanvas();
        this.ctx.translate(this.camera_x, 0);
        this.drawBackground();
        this.ctx.translate(-this.camera_x, 0);
        this.ctx.translate(this.camera_x, 0);
        this.drawGameObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawUI();
        this.requestNextFrame();
    }

    /**
     * Clears the canvas before redrawing.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws background objects of the level.
     */
    drawBackground() {
        this.addObjectsToMap(this.level.backgroundObjects);
    }

    /**
     * Draws the status bars and other UI elements.
     */
    drawUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarEndboss);
    }

    /**
     * Draws the main game objects like character, enemies, coins, bottles, etc.
     */
    drawGameObjects() {
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.tabascoBottles);
    }

    /**
     * Requests the next animation frame to continue drawing.
     */
    requestNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Adds a list of drawable objects to the canvas.
     * @param {DrawableObject[]} objects - An array of objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds a single drawable object to the canvas, flipping if necessary.
     * @param {DrawableObject} mo - The object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        // mo.drawFrame(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the object horizontally before drawing (used for mirroring).
     * @param {DrawableObject} mo - The object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the original position of the object after flipping.
     * @param {DrawableObject} mo - The object to flip back.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
