class StatusBar extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];
  percentage = 100;

  /**
   * Creates an instance of the class, initializes position, size,
   * loads images, and sets the initial percentage value.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 50;
    this.y = 0;
    this.width = 200;
    this.height = 50;
    this.setPercentage(100);
  }

  /**
   * Sets the current percentage value and updates the displayed image accordingly.
   *
   * @param {number} percentage - The new percentage value to set.
   * @returns {void}
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the image index based on the current percentage value.
   *
   * @returns {number} The index of the image corresponding to the current percentage.
   */
  resolveImageIndex() {
    if (this.percentage == 100) return 5;
    if (this.percentage > 80) return 4;
    if (this.percentage > 60) return 3;
    if (this.percentage > 40) return 2;
    if (this.percentage > 20) return 1;
    return 0;
  }
}

class StatusBarEndboss extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/blue100.png",
    "img/7_statusbars/2_statusbar_endboss/blue80.png",
    "img/7_statusbars/2_statusbar_endboss/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue20.png",
    "img/7_statusbars/2_statusbar_endboss/blue0.png",
  ];
  percentageEndboss = 100;

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
   * Reduces the Endboss's health by a specified amount, ensuring it doesn't drop below zero.
   * Updates the displayed health image based on the new health value.
   *
   * @param {number} amount - The amount of health to reduce.
   * @returns {void}
   */
  reduceHealth(amount) {
    this.percentageEndboss = Math.max(0, this.percentageEndboss - amount);
    let imageIndex = this.getHealthImageIndex();
    this.img = this.imageCache[this.IMAGES[imageIndex]];
  }

  getHealthImageIndex() {
    if (this.percentageEndboss > 80) return 0;
    if (this.percentageEndboss > 60) return 1;
    if (this.percentageEndboss > 40) return 2;
    if (this.percentageEndboss > 20) return 3;
    if (this.percentageEndboss > 0) return 4;
    return 5;
  }
}

class StatusBarCoin extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];
  percentageCoin = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 50;
    this.y = 40;
    this.width = 200;
    this.height = 50;
    this.setPercentage(0);
  }

  setPercentage(percentageCoin) {
    this.percentageCoin = percentageCoin;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentageCoin == 100) return 5;
    if (this.percentageCoin > 80) return 4;
    if (this.percentageCoin > 60) return 3;
    if (this.percentageCoin > 40) return 2;
    if (this.percentageCoin > 20) return 1;
    return 0;
  }
}

class StatusBarBottle extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];
  collectedBottles = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 50;
    this.y = 85;
    this.width = 200;
    this.height = 50;
    this.img = this.imageCache[this.IMAGES[0]];
    this.count(this.collectedBottles);
  }

  /**
   * Updates the count of collected bottles and updates the displayed image accordingly.
   *
   * @param {number} collectedBottles - The number of bottles collected.
   * @returns {void}
   */
  count(collectedBottles) {
    this.collectedBottles = collectedBottles;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.collectedBottles > 9) return 5;
    if (this.collectedBottles > 7) return 4;
    if (this.collectedBottles > 5) return 3;
    if (this.collectedBottles > 3) return 2;
    if (this.collectedBottles > 0) return 1;
    return 0;
  }
}
