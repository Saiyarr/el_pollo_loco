class Chicken extends MovableObject {
  y = 370;
  height = 65;
  width = 85;
  offsetX = 5;
  offsetY = 0;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Creates a new Chicken instance with random x-position and speed,
   * and starts its animation.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = 200 + Math.random() * 2100;
    this.speed = 0.15 + Math.random() * 0.8;
    this.animate();
  }

  /**
   * Assigns the game world context to the chicken.
   * @param {object} world - The world the chicken exists in.
   */
  setWorld(world) {
    this.world = world;
  }

  /**
   * Starts movement and walking animation of the chicken.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  /**
   * Replaces this chicken with a dead enemy sprite,
   * plays sound, and removes it from the level.
   */
  replaceWithDeadEnemy() {
    let deadImagePath =
      this instanceof Chick
        ? "img/3_enemies_chicken/chicken_small/2_dead/dead.png"
        : "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

    let deadEnemy = new DeadEnemy(
      this.x,
      this.y,
      this.width,
      this.height,
      deadImagePath,
      this.world
    );
    this.world.level.enemies.push(deadEnemy);

    destroyChickenSound.currentTime = 0;
    destroyChickenSound.play();

    let index = this.world.level.enemies.indexOf(this);
    if (index !== -1) {
      this.world.level.enemies.splice(index, 1);
    }
  }

  /**
   * Handles the logic when the chicken is hit by a bottle.
   * Shows dead image, stops movement, and removes it after delay.
   */
  handleBottleHit() {
    let deadImagePath =
      this instanceof Chick
        ? "img/3_enemies_chicken/chicken_small/2_dead/dead.png"
        : "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

    this.loadImage(deadImagePath);
    this.speed = 0;

    setTimeout(() => {
      let index = this.world.level.enemies.indexOf(this);
      if (index !== -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 500);
  }
}
