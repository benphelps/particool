import GameMatrix from '../../GameMatrix';
import Particle from '../Particle';
import Solid from '../Solid';

class Gunpowder extends Solid {
  color: [number, number, number, number] = [117, 117, 117, 1];

  flow = 3;

  flameability: number = 50;

  flamable: boolean = true;

  corrodibility: number = 0.3;

  static collidesWith(particle: Particle) {
    if (particle && ((particle instanceof Solid) || (particle instanceof Gunpowder))) {
      return true;
    }

    return false;
  }

  update(matrix: GameMatrix) {
    const down = matrix.particleAt(this.x, this.y + 1);
    const leftDown = matrix.particleAt(this.x - 1, this.y + 1);
    const rightDown = matrix.particleAt(this.x + 1, this.y + 1);

    if (!Gunpowder.collidesWith(down)) {
      matrix.swapParticles(this, down);
    } else {
      const rand = Math.random();
      if (rand > 0.5 && !Gunpowder.collidesWith(leftDown)) {
        matrix.swapParticles(this, leftDown);
      } else if (rand <= 0.5 && !Gunpowder.collidesWith(rightDown)) {
        matrix.swapParticles(this, rightDown);
      }
    }
  }
}

export default Gunpowder;
