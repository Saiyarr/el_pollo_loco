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

  /**
   * Creates a new coin status bar and initializes image and position.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 50;
    this.y = 40;
    this.width = 200;
    this.height = 50;
    this.setPercentage(0);
  }

  /**
   * Sets the current coin percentage and updates the status bar image.
   * @param {number} percentageCoin - The coin collection percentage (0-100).
   */
  setPercentage(percentageCoin) {
    this.percentageCoin = percentageCoin;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the correct image index based on the current percentage.
   * @returns {number} Index of the image to display.
   */
  resolveImageIndex() {
    if (this.percentageCoin == 100) {
      return 5;
    } else if (this.percentageCoin > 80) {
      return 4;
    } else if (this.percentageCoin > 60) {
      return 3;
    } else if (this.percentageCoin > 40) {
      return 2;
    } else if (this.percentageCoin > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
