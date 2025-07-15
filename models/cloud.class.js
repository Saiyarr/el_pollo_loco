class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;

  /**
   * Creates a new Cloud instance with a random x-position
   * and starts the animation.
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Starts moving the cloud slowly to the left to simulate background motion.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
