// src/utils/sound.js
const clickAudio = new Audio(require('./sounds/click2.wav'));

// Confirm the sound is loaded
clickAudio.addEventListener('canplaythrough', () => {
  console.log('Click sound loaded and ready!');
}, { once: true });

export const playClickSound = () => {
  clickAudio.currentTime = 0; // rewind
  clickAudio.play();
};
