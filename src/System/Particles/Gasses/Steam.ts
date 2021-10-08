import GameMatrix from '../../GameMatrix';
import Gas from '../Gas';
import Water from '../Liquids/Water';
import Particle from '../Particle';
import Solid from '../Solid';
import Air from './Air';

class Steam extends Gas {
  color: [number, number, number, number] = [97, 196, 255, 0.5];

  density: number = 0.1;

  flow: 20;

  lifetime: number = 0.99;

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

    const chanceToCondense = Math.random();
    if (chanceToCondense > this.lifetime) {
      matrix.replaceParticle(this, Water);
      return;
    }

    // random spread left and right always
    const randSpread = Math.random();
    if (randSpread > 0.9 && ((left instanceof Air) || (left instanceof Steam))) {
      matrix.swapParticles(this, left);
    } else if (randSpread < 0.1 && ((right instanceof Air) || (right instanceof Steam))) {
      matrix.swapParticles(this, right);
    }

    // normal collision spread
    if (!Steam.collidesWith(up)) {
      matrix.swapParticles(this, up);
    } else if (!Steam.collidesWith(leftUp)) {
      matrix.swapParticles(this, leftUp);
    } else if (!Steam.collidesWith(rightUp)) {
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

        if (rand > 0.5 && ((left instanceof Air) || (left instanceof Steam))) {
          matrix.swapParticles(this, farLeft);
        } else if (rand <= 0.5 && ((left instanceof Air) || (left instanceof Steam))) {
          matrix.swapParticles(this, farRight);
        }

        if (hitAnything) break;
      }
    }
  }
}

export default Steam;
