const clickAudio = new Audio(require('./sounds/click2.wav'));

// Confirm the sound is loaded
clickAudio.addEventListener('canplaythrough', () => {
  console.log('Click sound loaded and ready!');
}, { once: true });

export const playClickSound = () => {
  clickAudio.currentTime = 0; // rewind
  clickAudio.play();
};


const clickAudio2 = new Audio(require('./sounds/click.wav'));

// Confirm the sound is loaded
clickAudio2.addEventListener('canplaythrough', () => {
  console.log('Click sound loaded and ready!');
}, { once: true });

export const playClickSound2 = () => {
  clickAudio2.currentTime = 0; // rewind
  clickAudio2.play();
};

const previewAudio = new Audio(require('./sounds/preview.ogg'));

// Confirm the sound is loaded
previewAudio.addEventListener('canplaythrough', () => {
  console.log('Preview sound loaded and ready!');
}, { once: true });

export const previewSong = () => {
  previewAudio.currentTime = 0; // rewind
  previewAudio.play();
}

const gameSong = new Audio(require('./sounds/gameplay.ogg'));

// Confirm the sound is loaded
gameSong.addEventListener('canplaythrough', () => {
  console.log('Game sound loaded and ready!');
}, { once: true });

export const playGameSong = (flag) => {
  if (!flag) {
    // Smooth fade out
    let fadeOut = setInterval(() => {
      if (gameSong.volume > 0.05) {
        gameSong.volume = Math.max(0, gameSong.volume - 0.05);
      } else {
        clearInterval(fadeOut);
        gameSong.pause();
        gameSong.currentTime = 0;
        gameSong.volume = 1; // reset for next play
      }
    }, 100); // decrease every 100ms
    return;
  }

  // Play from start with normal volume
  gameSong.currentTime = 0;
  gameSong.volume = 1;
  gameSong.play();
};

export const ScoreCardSound = new Audio(require('./sounds/scoreCard.mp3'));

// Confirm the sound is loaded
ScoreCardSound.addEventListener('canplaythrough', () => {
  console.log('ScoreCard sound loaded and ready!');
}, { once: true });

export const playScoreCardSound = () => {
  ScoreCardSound.currentTime = 0; // rewind
  ScoreCardSound.play();
};