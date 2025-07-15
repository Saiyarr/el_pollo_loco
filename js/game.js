let canvas;
let world;
let moveLeftInterval, moveRightInterval;
let keyboard = new Keyboard();
let enemiesSetted = false;

/**
 * Initializes the game by setting up the canvas, level, and world.
 */
function init() {
    canvas = document.getElementById('canvas');
    level1 = createLevel();
    world = new World(canvas, keyboard, level1);

    setTimeout(() => {
        enableStartButton();
    }, 500);
}

/**
 * Enables the start button once the game is initialized.
 */
function enableStartButton() {
    document.getElementById("start-game-button").disabled = false;
}

/** Keyboard input events for key down */
window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
});

/** Keyboard input events for key up */
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
});

/**
 * Returns to the main menu after winning the game.
 */
function backToMainMenu() {
    document.getElementById('win-overlay').classList.remove('d-flex');
    document.getElementById('win-overlay').classList.add('d-none');
    resetGameFully();
}

/**
 * Returns to the main menu after losing the game.
 */
function backToMainMenuAfterLose() {
    document.getElementById('lose-overlay').classList.remove('d-flex');
    document.getElementById('lose-overlay').classList.add('d-none');
    document.getElementById('start-overlay').classList.remove('d-none');
    resetGameFully();
}

/**
 * Fully resets the game: world, level, canvas and UI.
 */
function resetGameFully() {
    stopAllIntervals();
    cancelWorldAnimationFrame();
    resetUI();
    resetLevel();
    clearCanvas();
    setTimeout(() => {
        world = null;
        init();
    }, 100);
}

/**
 * Cancels the current animation frame to stop the game loop.
 */
function cancelWorldAnimationFrame() {
    if (world && world.animationFrameId) {
        cancelAnimationFrame(world.animationFrameId);
    }
}

/**
 * Resets the UI to its initial state.
 */
function resetUI() {
    document.getElementById("start-game-button").disabled = true;
    document.getElementById('canvas').classList.add('d-none');
    document.getElementById('start-overlay').classList.remove('d-none');
}

/**
 * Resets the level data including enemies, coins and bottles.
 */
function resetLevel() {
    level1.enemies = [];
    level1.coins = [];
    level1.tabascoBottles = [];
    throwableObjects = [];
    enemiesSetted = false;
    level1 = createLevel();
}

/**
 * Clears the entire canvas.
 */
function clearCanvas() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Resets game state after losing and restarts the game.
 */
function resetGameLose() {
    stopAllIntervals();
    world = null;
    level1.enemies = [];
    level1.coins = [];
    level1.tabascoBottles = [];
    throwableObjects = []; 
    enemiesSetted = false;
    level1 = createLevel();
    clearCanvas();
    init();
}

/**
 * Starts the game again after winning.
 */
function startGameAgain() {
    document.getElementById('win-overlay').classList.remove('d-flex');
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('canvas').classList.remove('d-none');
    setEnemiesForRetry();
}

/**
 * Adds new enemies for retrying the game after win/lose.
 */
function setEnemiesForRetry() {
    if (enemiesSetted) return;

    level1.enemies = [
        new Chicken(),
        new Chick(),
        new Chicken(),
        new Chick(),
        new BossChicken()
    ];
    enemiesSetted = true;
    world.setWorld();
    world.draw();
}

/**
 * Displays the winning screen overlay.
 */
function showWinningScreen() {
    setTimeout(() => {
        document.getElementById('canvas').classList.add('d-none');
        document.getElementById('win-overlay').classList.remove('d-none');
        document.getElementById('win-overlay').classList.add('d-flex');
        winSound.currentTime = 0;
        winSound.play();
    }, 1400);
    resetGame();
}

/**
 * Displays the losing screen overlay.
 */
function showLosingScreen() {
    losesound.currentTime = 0;
    losesound.play();

    if (world && world.character && !world.character.isDead()) return;

    document.getElementById('canvas').classList.add('d-none');
    document.getElementById('lose-overlay').classList.remove('d-none');
    document.getElementById('lose-overlay').classList.add('d-flex');
}

/**
 * Restarts the game after the losing screen.
 */
function restartGameAfterLose() {
    document.getElementById('canvas').classList.remove('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.remove('d-flex');
    level1.enemies = [
        new Chicken(),
        new Chick(),
        new Chicken(),
        new Chick(),
        new BossChicken()
    ];
    enemiesSetted = true;
    world.setWorld(); 
    world.draw();
}

/**
 * Handles mobile left movement (touch start).
 */
function mobileMoveLeftStart() {
    keyboard.LEFT = true;
    if (!moveLeftInterval) {
        moveLeftInterval = setInterval(() => {
            keyboard.LEFT = true;
        }, 100);
    }
}

/**
 * Handles mobile left movement (touch end).
 */
function mobileMoveLeftEnd() {
    keyboard.LEFT = false;
    clearInterval(moveLeftInterval);
    moveLeftInterval = null;
}

/**
 * Handles mobile right movement (touch start).
 */
function mobileMoveRightStart() {
    keyboard.RIGHT = true;
    if (!moveRightInterval) {
        moveRightInterval = setInterval(() => {
            keyboard.RIGHT = true;
        }, 100);
    }
}

/**
 * Handles mobile right movement (touch end).
 */
function mobileMoveRightEnd() {
    keyboard.RIGHT = false;
    clearInterval(moveRightInterval);
    moveRightInterval = null;
}

/**
 * Handles mobile jump input.
 */
function mobileJump() {
    keyboard.SPACE = true;
    setTimeout(() => {
        keyboard.SPACE = false;
    }, 200);
}

/**
 * Handles mobile throw input.
 */
function mobileThrow() {
    keyboard.D = true;
    setTimeout(() => {
        keyboard.D = false;
    }, 200);
}

/** Clears input when releasing touch on movement buttons */
document.addEventListener("touchend", (event) => {
    if (event.target.closest(".arrow")) {
        keyboard.LEFT = false;
        keyboard.RIGHT = false;
        clearInterval(moveLeftInterval);
        clearInterval(moveRightInterval);
        moveLeftInterval = null;
        moveRightInterval = null;
    }
});

/** Disables context menu on mobile buttons */
document.addEventListener("contextmenu", function (event) {
    if (event.target.closest(".nav-control-buttons, .arrow, .jump-button, .throw-button")) {
        event.preventDefault();
    }
});

/** Prevents scroll when using touch controls */
document.addEventListener("touchstart", function (event) {
    if (event.target.closest(".arrow")) {
        event.preventDefault();
    }
}, { passive: false });

document.addEventListener("touchend", function (event) {
    if (event.target.closest(".arrow")) {
        event.preventDefault();
    }
});

/**
 * Shows the imprint screen (legal info).
 */
function showImprint() {
    document.getElementById('start-overlay').classList.remove('d-flex');
    document.getElementById('start-overlay').classList.add('d-none');
    document.getElementById('imprint-overlay').classList.remove('d-none');
    document.getElementById('imprint-overlay').classList.add('d-flex');
}

/**
 * Returns from imprint screen to start menu.
 */
function removeImprint() {
    document.getElementById('imprint-overlay').classList.remove('d-flex');
    document.getElementById('imprint-overlay').classList.add('d-none');
    document.getElementById('start-overlay').classList.remove('d-none');
    document.getElementById('start-overlay').classList.add('d-flex');
}

/**
 * Shows the instructions screen.
 */
function showInstructions() {
    document.getElementById('start-overlay').classList.remove('d-flex');
    document.getElementById('start-overlay').classList.add('d-none');
    document.getElementById('instructions-overlay').classList.remove('d-none');
    document.getElementById('instructions-overlay').classList.add('d-flex');
}

/**
 * Returns from instructions screen to start menu.
 */
function removeInstructions() {
    document.getElementById('instructions-overlay').classList.remove('d-flex');
    document.getElementById('instructions-overlay').classList.add('d-none');
    document.getElementById('start-overlay').classList.remove('d-none');
    document.getElementById('start-overlay').classList.add('d-flex');
}

/**
 * Resets the game after win/loss with a delay.
 */
function resetGame() {
    setTimeout(() => {
        world = null;
        level1.enemies = [];
        level1.coins = [];
        level1.tabascoBottles = [];
        enemiesSetted = false;
        level1 = createLevel();
        clearCanvas();
        stopAllIntervals();
        init();
    }, 1500);
}

/**
 * Stops all active intervals in the browser.
 */
function stopAllIntervals() {
    let highestId = setInterval(() => {}, 1000);
    for (let i = 0; i <= highestId; i++) {
        clearInterval(i);
    }
}

/**
 * Stops all intervals except one (e.g. endboss death animation).
 * @param {number} deathInterval - Interval ID to exclude from clearing
 */
function stopAllIntervalsExceptEndbossDeath(deathInterval) {
    let highestId = setInterval(() => {}, 1000);
    for (let i = 0; i <= highestId; i++) {
        if (i !== deathInterval) {
            clearInterval(i);
        }
    }
}
