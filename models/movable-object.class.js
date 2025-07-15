class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  /**
   * Applies gravity to the object, affecting its vertical position over time.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.y = 250;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is currently above the ground level.
   * @returns {boolean} True if the object is above ground.
   */
  isAboveGround() {
    return this.y < 250;
  }

  /**
   * Checks for a collision with another movable object.
   * @param {MovableObject} mo - Another movable object to check collision with.
   * @returns {boolean} True if collision is detected.
   */
  isColliding(mo) {
    return (
      this.x + this.offsetX + (this.width - 2 * Math.abs(this.offsetX)) >
        mo.x + mo.offsetX &&
      this.y + this.offsetY + (this.height - 2 * Math.abs(this.offsetY)) >
        mo.y + mo.offsetY &&
      this.x + this.offsetX <
        mo.x + mo.offsetX + (mo.width - 2 * Math.abs(mo.offsetX)) &&
      this.y + this.offsetY <
        mo.y + mo.offsetY + (mo.height - 2 * Math.abs(mo.offsetY))
    );
  }

  /**
   * Reduces the object's energy when hit and plays a sound if still alive.
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
      playHurtSound();
    }
  }

  /**
   * Checks if the object has been recently hurt.
   * @returns {boolean} True if the object was hit less than 1 second ago.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks if the object is dead (energy is 0).
   * @returns {boolean} True if energy is 0.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays an animation by cycling through the provided image paths.
   * @param {string[]} images - Array of image paths for the animation.
   */
  playAnimation(images) {
    if (this instanceof BossChicken && this.isDead) return;
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right based on its speed.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left based on its speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump if it's on the ground.
   */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 30;
      jumpSound.currentTime = 0;
      jumpSound.play();
    }
  }

  /**
   * Calculates the bottom collision points of the object for advanced collision detection.
   * @returns {Object} An object containing bottom X and Y coordinates.
   */
  getCollisionPoints() {
    let horizontalTolerance = 5;
    return {
      bottomMiddleX: this.x + this.width / 2,
      bottomLeftX: this.x + horizontalTolerance,
      bottomRightX: this.x + this.width - horizontalTolerance,
      bottomY: this.y + this.height,
    };
  }

  /**
   * Determines if the object is jumping on top of an enemy.
   * @param {MovableObject} enemy - The enemy object to check.
   * @returns {boolean} True if the object is stomping the enemy from above.
   */
  isJumpingOnEnemy(enemy) {
    let { bottomY } = this.getCollisionPoints();
    let verticalTolerance = 5;
    let isColliding = this.isCollidingCrashPoints(enemy);
    let isFalling = this.speedY < 0;

    return (
      isColliding &&
      isFalling &&
      bottomY > enemy.y + enemy.offsetY - verticalTolerance &&
      bottomY < enemy.y + enemy.offsetY + enemy.height
    );
  }

  /**
   * Helper function to check if the bottom points of the object intersect with an enemy.
   * @param {MovableObject} enemy - The enemy object to check.
   * @returns {boolean} True if any bottom point overlaps horizontally with the enemy.
   */
  isCollidingCrashPoints(enemy) {
    let { bottomMiddleX, bottomLeftX, bottomRightX } =
      this.getCollisionPoints();
    let horizontalTolerance = 5;

    return (
      (bottomMiddleX > enemy.x + enemy.offsetX - horizontalTolerance &&
        bottomMiddleX <
          enemy.x + enemy.offsetX + enemy.width + horizontalTolerance) ||
      (bottomLeftX > enemy.x + enemy.offsetX - horizontalTolerance &&
        bottomLeftX <
          enemy.x + enemy.offsetX + enemy.width + horizontalTolerance) ||
      (bottomRightX > enemy.x + enemy.offsetX - horizontalTolerance &&
        bottomRightX <
          enemy.x + enemy.offsetX + enemy.width + horizontalTolerance)
    );
  }
}
