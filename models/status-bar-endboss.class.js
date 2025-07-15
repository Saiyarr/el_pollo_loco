class StatusBarEndboss extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/blue.png",
    "img/7_statusbars/2_statusbar_endboss/blue.png",
    "img/7_statusbars/2_statusbar_endboss/blue.png",
    "img/7_statusbars/2_statusbar_endboss/blue.png",
    "img/7_statusbars/2_statusbar_endboss/blue.png",
    "img/7_statusbars/2_statusbar_endboss/blue.png",
  ];
  percentageEndboss = 100;

  /**
   * Initializes the endboss status bar with default values and loads images.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 350;
    this.y = 5;
    this.width = 180;
    this.height = 50;
    this.img = this.imageCache[this.IMAGES[0]];
  }

  /**
   * Reduces the endboss's health by the given amount and updates the image.
   * @param {number} amount - The amount of health to subtract.
   */
  reduceHealth(amount) {
    if (this.percentageEndboss > 0) {
      this.percentageEndboss -= amount;
    }

    if (this.percentageEndboss < 0) {
      this.percentageEndboss = 0;
    }

    let imageIndex = this.getHealthImageIndex();
    this.img = this.imageCache[this.IMAGES[imageIndex]];
  }

  /**
   * Determines which image index should be shown based on current health.
   * @returns {number} Index of the health bar image.
   */
  getHealthImageIndex() {
    if (this.percentageEndboss > 80) return 0;
    if (this.percentageEndboss > 60) return 1;
    if (this.percentageEndboss > 40) return 2;
    if (this.percentageEndboss > 20) return 3;
    if (this.percentageEndboss > 0) return 4;
    return 5;
  }
}
