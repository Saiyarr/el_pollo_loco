class Coin extends DrawableObject {
  y = 300;
  x;
  width = 93;
  height = 93;
  offsetX = 30;
  offsetY = 30;
  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];
  loadedImages = [];
  currentImage = 0;

  /**
   * Creates a new Coin instance at a random x-position
   * and starts animation after preloading images.
   */
  constructor() {
    super();
    this.x = 350 + Math.random() * (2200 - 100);
    this.y = 335;

    this.preloadImages();
    this.animate();
  }

  /**
   * Preloads all coin animation images into memory.
   */
  preloadImages() {
    this.IMAGES_COIN.forEach((src, index) => {
      this.loadedImages[index] = new Image();
      this.loadedImages[index].src = src;
    });
  }

  /**
   * Animates the coin by switching between images at intervals.
   * Also adjusts coin size depending on the current frame.
   */
  animate() {
    setInterval(() => {
      this.currentImage = (this.currentImage + 1) % this.IMAGES_COIN.length;
      this.img = this.loadedImages[this.currentImage];
      this.width = this.currentImage === 1 ? 96 : 93;
      this.height = this.currentImage === 1 ? 96 : 93;
    }, 500);
  }
}
