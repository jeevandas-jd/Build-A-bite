import { Howl } from 'howler';

const clickSound = new Howl({
  src: ['/sounds/click.wav'], // Add your click.wav in public/sounds folder
  volume: 0.5,
});

const successSound = new Howl({
  src: ['/sounds/success.wav'], // Add your success.wav in public/sounds folder
  volume: 0.5,
});

export { clickSound, successSound };
