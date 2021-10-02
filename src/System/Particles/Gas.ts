import Particle from './Particle';

class Gas extends Particle {
  color: [number, number, number, number] = [0, 255, 0, 255];

  density: number = 0.5;
}

export default Gas;
