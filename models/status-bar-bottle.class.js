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

  /**
   * Initializes the bottle status bar with default values and loads images.
   */
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
   * Updates the status bar image based on collected bottles.
   * @param {number} collectedBottles - The number of bottles collected.
   */
  count(collectedBottles) {
    this.collectedBottles = collectedBottles;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the correct image index based on number of collected bottles.
   * @returns {number} The index for the current image.
   */
  resolveImageIndex() {
    if (this.collectedBottles > 9) {
      return 5;
    } else if (this.collectedBottles > 7) {
      return 4;
    } else if (this.collectedBottles > 5) {
      return 3;
    } else if (this.collectedBottles > 3) {
      return 2;
    } else if (this.collectedBottles > 0) {
      return 1;
    } else {
      return 0;
    }
  }
}
