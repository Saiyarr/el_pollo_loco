class ThrowableObject extends MovableObject {
    rotationAngle = 0;
    IMAGES_BOTTLESPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Initializes a throwable object, loads splash images and starts movement, rotation, and collision tracking.
     * @param {number} x - Initial x-position
     * @param {number} y - Initial y-position
     * @param {object} world - Reference to the game world
     */
    constructor(x, y, world) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLESPLASH);
        this.x = x;
        this.y = y;
        this.height = 90;
        this.width = 70;
        this.world = world;
        this.throw();
        this.startRotation();
        this.trackPosition();
    }

    /**
     * Starts horizontal throwing motion and handles out-of-bounds cleanup.
     */
    throw() {
        this.speedY = 25;
        this.applyGravityBottle();
        let direction = this.world.character.otherDirection ? -1 : 1;
        throwSound.currentTime = 0;
        throwSound.play();

        this.throwInterval = setInterval(() => {
            this.x += 12 * direction;
            if (this.y > 720 || this.x < 0) {
                this.removeBottle();
            }
        }, 25);
    }

    /**
     * Simulates gravity for the thrown object.
     */
    applyGravityBottle() {
        this.acceleration = 2;
        let gravityInterval = setInterval(() => {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            if (this.speedY < 0) {
                this.speedY -= this.acceleration;
            }
            if (this.y > 720) {
                clearInterval(gravityInterval);
                this.removeBottle();
            }
        }, 1000 / 25);
    }

    /**
     * Starts bottle rotation animation.
     */
    startRotation() {
        this.rotationInterval = setInterval(() => {
            this.rotationAngle += 15;
            if (this.rotationAngle >= 360) {
                this.rotationAngle = 0;
            }
        }, 40);
    }

    /**
     * Stops the rotation animation.
     */
    stopRotation() {
        clearInterval(this.rotationInterval);
    }

    /**
     * Begins continuously checking for collisions.
     */
    trackPosition() {
        requestAnimationFrame(() => this.checkCollisions());
    }

    /**
     * Checks collision between this bottle and enemies.
     */
    checkCollisions() {
        if (this.isRemoved) return;
        if (!this.isGameValid()) return;
        this.world.level.enemies.forEach((enemy) => {
            if (this.shouldIgnoreCollision(enemy)) return;
            if (this.isCollidingWithEnemy(enemy)) {
                this.handleCollision(enemy);
            }
        });

        this.checkOutOfBounds();
        requestAnimationFrame(() => this.checkCollisions());
    }

    /**
     * Validates that the game world and enemy list exist.
     * @returns {boolean}
     */
    isGameValid() {
        return !!(this.world && this.world.level && this.world.level.enemies.length);
    }

    /**
     * Determines if the enemy should be ignored for collision (e.g., dead boss).
     * @param {object} enemy
     * @returns {boolean}
     */
    shouldIgnoreCollision(enemy) {
        return enemy instanceof BossChicken && enemy.isDead;
    }

    /**
     * Handles logic for a successful collision.
     * @param {object} enemy
     */
    handleCollision(enemy) {
        if (!(enemy instanceof Chick || enemy instanceof Chicken || enemy instanceof BossChicken)) return;

        if (!enemy.hasBeenHit) {
            enemy.hasBeenHit = true;

            if (enemy instanceof BossChicken) {
                this.handleBossCollision(enemy);
            } else {
                this.handleRegularEnemyCollision(enemy);
            }

            this.playSplashAnimation(enemy);
            this.removeBottle();
        }
    }

    /**
     * Plays splash animation upon hitting an enemy.
     * @param {object} enemy
     */
    playSplashAnimation(enemy) {
        let splash = this.createSplashObject(enemy);
        this.animateSplash(splash);
        this.world.level.enemies.push(splash);
    }

    /**
     * Creates splash DrawableObject based on enemy position.
     * @param {object} enemy
     * @returns {DrawableObject}
     */
    createSplashObject(enemy) {
        let splash = new DrawableObject();
        let { splashX, splashY } = this.calculateSplashCoordinates(enemy);
        splash.x = splashX;
        splash.y = splashY;
        splash.width = 48;
        splash.height = 48;
        return splash;
    }

    /**
     * Animates the splash object using the splash image sequence.
     * @param {DrawableObject} splash
     */
    animateSplash(splash) {
        let imgIndex = 0;
        let splashInterval = setInterval(() => {
            if (imgIndex < this.IMAGES_BOTTLESPLASH.length) {
                splash.img = this.imageCache[this.IMAGES_BOTTLESPLASH[imgIndex]];
                imgIndex++;
            } else {
                clearInterval(splashInterval);
                this.world.level.enemies.splice(this.world.level.enemies.indexOf(splash), 1);
            }
        }, 100);
    }

    /**
     * Calculates the X and Y coordinates for placing the splash.
     * @param {object} enemy
     * @returns {{splashX: number, splashY: number}}
     */
    calculateSplashCoordinates(enemy) {
        let additionalOffsetX = (enemy instanceof BossChicken) ? enemy.offsetX : 0;
        let splashX = (this.x + this.width / 2 < enemy.x + enemy.width / 2)
            ? enemy.x - this.width / 2 + additionalOffsetX
            : enemy.x + enemy.width - this.width / 2 + additionalOffsetX;
        let splashY = enemy.y + enemy.height / 2 - this.height / 4;
        return { splashX, splashY };
    }

    /**
     * Handles boss-specific collision logic, including damage and death.
     * @param {BossChicken} enemy
     */
    handleBossCollision(enemy) {
        this.world.statusBarEndboss.reduceHealth(20);
        if (this.world.statusBarEndboss.percentageEndboss <= 0 && !enemy.isDead) {
            enemy.removeEnemy();
        } else {
            enemy.playHurtAnimation();
        }
        if (!enemy.isDead) {
            setTimeout(() => {
                enemy.hasBeenHit = false;
            }, 1000);
        }
    }

    /**
     * Handles collision logic for regular chickens.
     * @param {Chick|Chicken} enemy
     */
    handleRegularEnemyCollision(enemy) {
        this.stopRotation();
        if (enemy instanceof Chick || enemy instanceof Chicken) {
            enemy.replaceWithDeadEnemy();
        }
    }

    /**
     * Removes the bottle if it goes off screen.
     */
    checkOutOfBounds() {
        if (this.y > 500 || this.x < 0) {
            this.removeBottle();
        }
    }

    /**
     * Draws the rotated bottle on canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotationAngle * Math.PI / 180);
        ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        super.draw(ctx);
        ctx.restore();
    }

    /**
     * Cleans up the bottle after use or when off screen.
     */
    removeBottle() {
        clearInterval(this.throwInterval);
        clearInterval(this.rotationInterval);
        this.isRemoved = true;
        let index = this.world.throwableObjects.indexOf(this);
        if (index !== -1) {
            this.world.throwableObjects.splice(index, 1);
        }
    }

    /**
     * Checks if the bottle is colliding with a given enemy.
     * @param {object} enemy
     * @returns {boolean}
     */
    isCollidingWithEnemy(enemy) {
        let bottleCenterX = this.x + this.width / 2;
        let bottleCenterY = this.y + this.height / 2;
        let enemyCenterX = enemy.x + enemy.width / 2;
        let enemyCenterY = enemy.y + enemy.height / 2;

        if (enemy instanceof BossChicken) {
            enemyCenterX += enemy.offsetX;
        }

        let dx = Math.abs(bottleCenterX - enemyCenterX);
        let dy = Math.abs(bottleCenterY - enemyCenterY);

        return (dx < (this.width / 2 + enemy.width / 2)) &&
               (dy < (this.height / 2 + enemy.height / 2));
    }
}
