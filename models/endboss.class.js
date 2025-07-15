class BossChicken extends MovableObject {
  y = 75;
  height = 400;
  width = 250;
  offsetX = 30;
  offsetY = 0;
  waitingAnimationInterval = null;
  attackStarted = false;
  isHurt = false;
  hasBeenHit = false;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACKING = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Constructs a BossChicken instance and initializes all properties and animations.
   */
  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2500;
    this.speed = 0.15 + Math.random() * 0.5;
    this.isDead = false;
    this.isFrozen = false;

    this.animationWaitingBoss();
    this.checkForAttackTrigger();
  }

  /**
   * Marks the enemy as dead and initiates death animation.
   */
  removeEnemy() {
    this.deathXCoordinate = this.x;
    this.isDead = true;
    this.isFrozen = true;
    this.img = null;
    this.imageCache = null;
    stopAllIntervalsExceptEndbossDeath();
    this.deadEndbossAnimation();
  }

  /**
   * Moves the boss left if not frozen or dead.
   */
  moveLeft() {
    if (this.isFrozen || this.isDead) return;
    this.x -= this.speed;
  }

  /**
   * Moves the boss right if not frozen or dead.
   */
  moveRight() {
    if (this.isFrozen || this.isDead) return;
    this.x += this.speed;
  }

  /**
   * Plays the boss's hurt animation and sound.
   */
  playHurtAnimation() {
    if (this.isHurt) return;
    this.isHurt = true;
    this.isFrozen = true;
    deathboss.currentTime = 0;
    deathboss.play();

    let hurtInterval = this.startHurtAnimation();

    setTimeout(() => {
      this.stopHurtAnimation(hurtInterval);
    }, 1000);
  }

  /**
   * Starts the interval for hurt animation frames.
   * @returns {number} Interval ID
   */
  startHurtAnimation() {
    let imgIndex = 0;
    return setInterval(() => {
      this.img = this.imageCache[this.IMAGES_HURT[imgIndex]];
      imgIndex = (imgIndex + 1) % this.IMAGES_HURT.length;
    }, 100);
  }

  /**
   * Stops the hurt animation and resumes walking.
   * @param {number} hurtInterval
   */
  stopHurtAnimation(hurtInterval) {
    clearInterval(hurtInterval);
    this.isHurt = false;
    this.isFrozen = false;
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Plays the death animation sequence and shows the win screen.
   */
  deadEndbossAnimation() {
    deathboss.currentTime = 0;
    deathboss.play();
    let deadChicken = new DrawableObject();
    deadChicken.x = this.deathXCoordinate;
    deadChicken.y = this.y;
    deadChicken.width = this.width;
    deadChicken.height = this.height;
    let imgIndex = 0;
    const animateDeadChicken = () => {
      if (imgIndex < this.IMAGES_DEAD.length) {
        deadChicken.img = new Image();
        deadChicken.img.src = this.IMAGES_DEAD[imgIndex];
        imgIndex++;
        setTimeout(animateDeadChicken, 300);
      }
    };
    this.world.level.enemies.push(deadChicken);
    animateDeadChicken();
    showWinningScreen();
  }

  /**
   * Sets the world context for the boss.
   * @param {Object} world
   */
  setWorld(world) {
    this.world = world;
  }

  /**
   * Starts the idle animation loop.
   */
  animationWaitingBoss() {
    this.waitingAnimationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ALERT);
    }, 200);
  }

  /**
   * Checks whether the boss should begin attacking based on player position.
   */
  checkForAttackTrigger() {
    let triggerCheckInterval = setInterval(() => {
      if (this.world && this.world.character.x >= 2000 && !this.attackStarted) {
        this.attackStarted = true;
        clearInterval(this.waitingAnimationInterval);
        clearInterval(triggerCheckInterval);
        this.startAttackCycle();
      }
    }, 100);
  }

  /**
   * Starts a new attack cycle.
   */
  startAttackCycle() {
    if (this.isDead) return;

    let startX = 2400;
    let minX = 2000;
    this.executeAttackCycle(startX, minX);
  }

  /**
   * Executes the boss's attack movement and animation logic.
   * @param {number} startX
   * @param {number} minX
   */
  executeAttackCycle(startX, minX) {
    if (this.isDead) return;
    if (this.x > minX) {
      this.animateAttack(() => {
        this.moveBackToStart(() => this.executeAttackCycle(startX, minX));
      });
    } else {
      this.returnToStartPosition(startX);
    }
  }

  /**
   * Returns the boss to its original position after attacking.
   * @param {number} startX
   */
  returnToStartPosition(startX) {
    if (this.isDead) return;
    let originalSpeed = this.speed;
    this.speed = 7;
    let returnInterval = setInterval(() => {
      if (this.x < startX) {
        this.moveRight();
      } else {
        clearInterval(returnInterval);
        this.speed = originalSpeed;
        this.startAttackCycle();
      }
    }, 1000 / 60);
  }

  /**
   * Animates the boss's attack sequence.
   * @param {Function} callback
   */
  animateAttack(callback) {
    if (this.isDead) return;
    let originalSpeed = this.speed;
    this.speed = 9;

    let attackInterval = this.startAttackMovement();
    let animationInterval = this.startAttackAnimation();

    this.stopAttackAfterDelay(
      attackInterval,
      animationInterval,
      originalSpeed,
      callback
    );
  }

  /**
   * Starts the movement during the attack phase.
   * @returns {number} Interval ID
   */
  startAttackMovement() {
    if (this.attackInterval) clearInterval(this.attackInterval);
    this.attackInterval = setInterval(() => {
      if (this.isDead) return clearInterval(this.attackInterval);
      this.moveLeft();
    }, 1000 / 60);
    return this.attackInterval;
  }

  /**
   * Starts the attack animation.
   * @returns {number} Interval ID
   */
  startAttackAnimation() {
    if (this.animationInterval) clearInterval(this.animationInterval);

    this.animationInterval = setInterval(() => {
      if (this.isDead) return clearInterval(this.animationInterval);
      this.playAnimation(this.IMAGES_ATTACKING);
    }, 200);

    return this.animationInterval;
  }

  /**
   * Stops the attack and resumes normal behavior after a delay.
   * @param {number} attackInterval
   * @param {number} animationInterval
   * @param {number} originalSpeed
   * @param {Function} callback
   */
  stopAttackAfterDelay(
    attackInterval,
    animationInterval,
    originalSpeed,
    callback
  ) {
    setTimeout(() => {
      clearInterval(attackInterval);
      clearInterval(animationInterval);
      this.speed = originalSpeed;
      if (!this.isDead && callback) callback();
    }, 900);
  }

  /**
   * Moves the boss back a short distance after attacking.
   * @param {Function} callback
   */
  moveBackToStart(callback) {
    if (this.isDead) return;
    let targetX = this.x + 60;
    this.startReturning(targetX, callback);
    this.startWalkingBack();
  }

  /**
   * Starts returning movement to a specific X coordinate.
   * @param {number} targetX
   * @param {Function} callback
   */
  startReturning(targetX, callback) {
    if (this.returnInterval) clearInterval(this.returnInterval);

    this.returnInterval = setInterval(() => {
      if (this.stopMovement()) return;
      if (this.x < targetX) {
        this.moveRight();
      } else {
        this.stopReturningMovement();
        this.decideReturn(callback);
      }
    }, 1000 / 60);
  }

  /**
   * Determines whether to repeat attack cycle or return to start.
   * @param {Function} callback
   */
  decideReturn(callback) {
    if (this.x > 500) {
      callback();
    } else {
      this.returnToStartPosition(2500);
    }
  }

  /**
   * Stops all movement if boss is dead.
   * @returns {boolean}
   */
  stopMovement() {
    if (this.isDead) {
      this.stopReturningMovement();
      this.stopWalking();
      return true;
    }
    return false;
  }

  /**
   * Clears the return movement interval.
   */
  stopReturningMovement() {
    if (this.returnInterval) {
      clearInterval(this.returnInterval);
      this.returnInterval = null;
    }
  }

  /**
   * Starts walking animation back to the starting point.
   */
  startWalkingBack() {
    if (this.walkingAnimation) clearInterval(this.walkingAnimation);
    let reversedImages = [...this.IMAGES_WALKING].reverse();
    let imgIndex = 0;
    this.walkingAnimation = setInterval(() => {
      if (this.stopMovement()) {
        this.stopWalking();
        return;
      }
      this.img = this.imageCache[reversedImages[imgIndex]];
      imgIndex = (imgIndex + 1) % reversedImages.length;
    }, 300);
  }

  /**
   * Stops the walking animation.
   */
  stopWalking() {
    if (this.walkingAnimation) {
      clearInterval(this.walkingAnimation);
      this.walkingAnimation = null;
    }
  }
}
