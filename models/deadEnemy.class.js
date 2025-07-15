class DeadEnemy extends DrawableObject {
  /**
   * Creates a new DeadEnemy instance and schedules removal of the object.
   * @param {number} x - The x-position of the enemy.
   * @param {number} y - The y-position of the enemy.
   * @param {number} width - The width of the enemy.
   * @param {number} height - The height of the enemy.
   * @param {string} imagePath - The path to the dead enemy image.
   * @param {object} world - The game world containing this enemy.
   */
  constructor(x, y, width, height, imagePath, world) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y + 20;
    this.width = width;
    this.height = height;
    this.world = world;

    this.removeAliveEnemy();
  }

  /**
   * Removes the dead enemy from the game world after a delay.
   */
  removeAliveEnemy() {
    setTimeout(() => {
      let index = this.world.level.enemies.indexOf(this);
      if (index !== -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 2000);
  }
}
