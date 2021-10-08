import GameMatrix from '../../GameMatrix';
import Gas from '../Gas';
import Particle from '../Particle';
import Solid from '../Solid';
import Air from './Air';

class Smoke extends Gas {
  color: [number, number, number, number] = [255, 255, 255, 0.35];

  density: number = 0.1;

  flow: 10;

  lifetime: number = 0.95;

  static collidesWith(particle: Particle) {
    if (particle && ((particle instanceof Particle) && !(particle instanceof Air))) {
      return true;
    }

    return false;
  }

  update(matrix: GameMatrix) {
    const up = matrix.particleAt(this.x, this.y - 1);
    const leftUp = matrix.particleAt(this.x - 1, this.y - 1);
    const rightUp = matrix.particleAt(this.x + 1, this.y - 1);
    const left = matrix.particleAt(this.x - 1, this.y);
    const right = matrix.particleAt(this.x + 1, this.y);

    const chanceToDissipate = Math.random();
    if (chanceToDissipate > this.lifetime) {
      matrix.replaceParticle(this, Air);
      return;
    }

    // random spread left and right always
    const randSpread = Math.random();
    if (randSpread > 0.9 && ((left instanceof Air) || (left instanceof Smoke))) {
      matrix.swapParticles(this, left);
    } else if (randSpread < 0.1 && ((right instanceof Air) || (right instanceof Smoke))) {
      matrix.swapParticles(this, right);
    }

    // normal collision spread
    if (!Smoke.collidesWith(up)) {
      matrix.swapParticles(this, up);
    } else if (!Smoke.collidesWith(leftUp)) {
      matrix.swapParticles(this, leftUp);
    } else if (!Smoke.collidesWith(rightUp)) {
      matrix.swapParticles(this, rightUp);
    } else {
      // eslint-disable-next-line no-alert
      const rand = Math.random();
      let hitAnything = false;

      for (let i = 1; i < this.flow; i += 1) {
        const farLeft = matrix.particleAt(this.x - i, this.y);
        const farRight = matrix.particleAt(this.x + i, this.y);

        if (farLeft instanceof Solid || farRight instanceof Solid) {
          if (!hitAnything) hitAnything = true;
        }

        if (rand > 0.5 && ((left instanceof Air) || (left instanceof Smoke))) {
          matrix.swapParticles(this, farLeft);
        } else if (rand <= 0.5 && ((left instanceof Air) || (left instanceof Smoke))) {
          matrix.swapParticles(this, farRight);
        }

        if (hitAnything) break;
      }
    }
  }
}

export default Smoke;
