import { Howl } from 'howler';

const clickSound = new Howl({
  src: ['/home/jeevandas/foodSimulationGame/Build-A-bite/build-a-bite-frontend/src/utils/sounds/click.wav'], // Add your click.wav in public/sounds folder
  volume: 0.5,
});
// /home/jeevandas/foodSimulationGame/Build-A-bite/build-a-bite-frontend/src/utils/sounds/click.wav
const successSound = new Howl({
  src: ['/home/jeevandas/foodSimulationGame/Build-A-bite/build-a-bite-frontend/src/utils/sounds/click.wav'], // Add your success.wav in public/sounds folder
  volume: 0.5,
});

export { clickSound, successSound };
