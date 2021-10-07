import Config from '../../Config';
import GameMatrix from '../../GameMatrix';
import Gas from '../Gas';
import Water from '../Liquids/Water';
import Particle from '../Particle';
import Air from './Air';

class Steam extends Gas {
  color: [number, number, number, number] = [97, 196, 255, 0.25];

  density: number = 0.1;

  flow: 10;

  lifetime: number = 0.999;

  static collidesWith(particle: Particle) {
    if (particle && ((particle instanceof Particle) && !(particle instanceof Air))) {
      return true;
    }

    return false;
  }

  draw(context: CanvasRenderingContext2D) {
    const x = this.x * Config.scale;
    const y = this.y * Config.scale;

    // eslint-disable-next-line no-param-reassign
    context.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.color[3]})`;
    context.fillRect(x, y, Config.scale, Config.scale);
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
      let hitAir = false;

      for (let i = 1; i < this.flow; i += 1) {
        const farLeft = matrix.particleAt(this.x - i, this.y);
        const farRight = matrix.particleAt(this.x + i, this.y);

        if (farLeft instanceof Air || farRight instanceof Air) {
          if (!hitAir) hitAir = true;
        }

        if (rand > 0.5 && ((left instanceof Air) || (left instanceof Steam))) {
          matrix.swapParticles(this, farLeft);
        } else if (rand <= 0.5 && ((left instanceof Air) || (left instanceof Steam))) {
          matrix.swapParticles(this, farRight);
        }

        if (hitAir) break;
      }
    }
  }
}

export default Steam;
