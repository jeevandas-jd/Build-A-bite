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

export const playGameSong = () => {
  gameSong.currentTime = 0; // rewind
  gameSong.play();
}