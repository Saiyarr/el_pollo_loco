/**
 * Creates and returns a new game level with background, clouds, coins, and bottles.
 * @returns {Level} The constructed Level object.
 */
function createLevel() {
    return new Level(
        [], 
        [
            new Cloud(),
            new Cloud()
        ],
        [
            new BackgroundObject('img/5_background/layers/air.png', -719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

            new BackgroundObject('img/5_background/layers/air.png', 719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

            new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

            new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),
        ],
        [
            new Coin(), new Coin(), new Coin(), new Coin(), new Coin(),
            new Coin(), new Coin(), new Coin(), new Coin(), new Coin(),
            new Coin()
        ],
        [
            new TabascoBottle(), new TabascoBottle(), new TabascoBottle(),
            new TabascoBottle(), new TabascoBottle(), new TabascoBottle(),
            new TabascoBottle(), new TabascoBottle(), new TabascoBottle(),
            new TabascoBottle(), new TabascoBottle(), new TabascoBottle()
        ]
    );
}

/**
 * Sets enemies when the game starts and hides the start screen overlay.
 */
function setEnemies() {
    document.getElementById('start-overlay').classList.remove('d-flex');
    document.getElementById('start-overlay').classList.add('d-none');
    document.getElementById('canvas').classList.remove('d-none');

    if (enemiesSetted) {
        return;
    }

    level1.enemies = [
        new Chicken(),
        new Chick(),
        new Chicken(),
        new Chick(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new BossChicken()
    ];

    enemiesSetted = true;
    world.setWorld();
    world.draw();
}

/**
 * Resets enemies and UI after the player loses and restarts the game.
 */
function setEnemiesAfterLose() {
    document.getElementById('overlay-losing-screen').classList.remove('d-flex');
    document.getElementById('overlay-losing-screen').classList.add('d-none');
    document.getElementById('canvas').classList.remove('d-none');

    if (enemiesSetted) {
        return;
    }

    level1.enemies = [
        new Chicken(),
        new Chick(),
        new Chicken(),
        new Chick(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new BossChicken()
    ];

    enemiesSetted = true;
    world.setWorld();
    world.draw();
}
