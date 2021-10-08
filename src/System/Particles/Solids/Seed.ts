import GameMatrix from '../../GameMatrix';
import Particle from '../Particle';
import Solid from '../Solid';

class Seed extends Solid {
  color: [number, number, number, number] = [37, 64, 42, 1];

  flow = 3;

  flameability: number = 50;

  flamable: boolean = true;

  corrodibility: number = 0.3;

  density: number = 1;

  static collidesWith(particle: Particle) {
    if (particle && ((particle instanceof Solid) || (particle instanceof Seed))) {
      return true;
    }

    return false;
  }

  update(matrix: GameMatrix) {
    const down = matrix.particleAt(this.x, this.y + 1);
    const leftDown = matrix.particleAt(this.x - 1, this.y + 1);
    const rightDown = matrix.particleAt(this.x + 1, this.y + 1);

    if (!Seed.collidesWith(down)) {
      matrix.swapParticles(this, down);
    } else {
      const rand = Math.random();
      if (rand > 0.5 && !Seed.collidesWith(leftDown)) {
        matrix.swapParticles(this, leftDown);
      } else if (rand <= 0.5 && !Seed.collidesWith(rightDown)) {
        matrix.swapParticles(this, rightDown);
      }
    }
  }
}

export default Seed;
