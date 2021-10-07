import GameMatrix from '../../GameMatrix';
import Gas from '../Gas';
import Particle from '../Particle';
import Air from './Air';

class Bubble extends Gas {
  color: [number, number, number, number] = [255, 255, 255, 1];

  density: number = 0.1;

  static collidesWith(particle: Particle) {
    if (particle && ((particle instanceof Particle) && !(particle instanceof Air))) {
      return true;
    }

    return false;
  }

  update(matrix: GameMatrix) {
    const up = matrix.particleAt(this.x, this.y + 1);

    if (up instanceof Air) {
      matrix.replaceParticle(this, Air);
    } else if (!Bubble.collidesWith(up)) {
      matrix.swapParticles(this, up);
    }
  }
}

export default Bubble;
