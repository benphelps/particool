import GameMatrix from '../../GameMatrix';
import Particle from '../Particle';
import Solid from '../Solid';
import Sand from './Sand';

class WetSand extends Solid {
  color: [number, number, number, number] = [173, 158, 111, 1];

  flow = 3;

  static collidesWith(particle: Particle) {
    if (particle && ((particle instanceof Solid) || (particle instanceof Sand)
    || (particle instanceof WetSand))) {
      return true;
    }

    return false;
  }

  update(matrix: GameMatrix) {
    const down = matrix.particleAt(this.x, this.y + 1);
    const leftDown = matrix.particleAt(this.x - 1, this.y + 1);
    const rightDown = matrix.particleAt(this.x + 1, this.y + 1);

    if (!WetSand.collidesWith(down)) {
      matrix.swapParticles(this, down);
    } else {
      const rand = Math.random();

      if (rand > 0.5 && !WetSand.collidesWith(leftDown)) {
        matrix.swapParticles(this, leftDown);
      } else if (rand <= 0.5 && !WetSand.collidesWith(rightDown)) {
        matrix.swapParticles(this, rightDown);
      }
    }
  }
}

export default WetSand;
