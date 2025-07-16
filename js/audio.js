/** Background music and game sound effects */
const jumpSound = new Audio('audio/jump.mp3'); 
const coinSound = new Audio('audio/coinCollect.mp3'); 
const bottleCollectSound = new Audio('audio/bottleCollect.mp3'); 
const throwSound = new Audio('audio/throwBottle.mp3'); 
const destroyChickenSound = new Audio('audio/chickenDies.mp3'); 
const hurtSound = new Audio('audio/charHurt.mp3'); 
const characterDies = new Audio('audio/charDies.mp3');
const deathboss = new Audio('audio/chickenDies.mp3');
const characdead = new Audio('audio/charHurt.mp3');
const winSound = new Audio('audio/win.wav');
const losesound = new Audio('audio/loose.wav');
const sleeping = new Audio('audio/sleeping.mp3');
const bgSound = new Audio('audio/backgroundMusic.mp3');

bgSound.volume = 0.1;
bgSound.loop = true;

let soundIsEnabled = false;


/** Array holding all audio objects for collective control */
const gameSounds = [
    bgSound, sleeping, winSound, losesound, jumpSound, coinSound,
    bottleCollectSound, throwSound, destroyChickenSound, hurtSound,
    characterDies, deathboss, characdead
];

/**
 * Initializes sound settings based on localStorage preference.
 * Runs on window load.
 */
window.addEventListener('load', () => {
    let soundIcon = document.getElementById("soundIcon");
    soundIsEnabled = localStorage.getItem("soundEnabled") === "true";

    bgSound.pause();
    
    if (soundIsEnabled) {
        soundIcon.src = "img/user_icons/sound_active.png";
       
        
    } else {
        soundIcon.src = "img/user_icons/sound_inactive.png";
        disableGameSounds();
    }
});



// Mute all sounds initially
gameSounds.forEach(sound => {
    sound.muted = true;
});


/**
 * Disables all game sounds and pauses the background music.
 */
function disableGameSounds() {
    gameSounds.forEach(sound => sound.muted = true);
    bgSound.pause();
}

/**
 * Enables all game sounds and plays background music if not already playing.
 */
function enableGameSounds() {
    gameSounds.forEach(sound => sound.muted = false);
    
    if (bgSound.paused) {
        bgSound.play().catch(error => console.warn("Audio play blocked:", error));
    }
}

/**
 * Toggles game sound on/off and updates icon + localStorage.
 */
function toggleGameSound() {
    let soundIcon = document.getElementById("soundIcon");
    const activeSound = "img/user_icons/sound_active.png";
    const inactiveSound = "img/user_icons/sound_inactive.png";
    

    if (soundIsEnabled) {
        soundIcon.src = inactiveSound;
        disableGameSounds();
        localStorage.setItem("soundEnabled", "false");
        soundIsEnabled = false;
    } else {
        soundIcon.src = activeSound;
        enableGameSounds();
        localStorage.setItem("soundEnabled", "true");
        soundIsEnabled = true;
    }
}

/**
 * Plays the hurt sound only if it is not already playing.
 */
function playHurtSound() {
    if (!hurtSound.muted && hurtSound.paused) {
        hurtSound.currentTime = 0;
        hurtSound.play();
    }
}
