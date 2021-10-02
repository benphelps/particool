import Config from '../../Config';
import GameMatrix from '../../GameMatrix';
import Gas from '../Gas';
import Particle from '../Particle';
import Air from './Air';

class Smoke extends Gas {
  color: [number, number, number, number] = [0, 0, 0, 0.25];

  density: number = 0.1;

  flow: 10;

  lifetime: number = 0.95;

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
      let hitAir = false;

      for (let i = 1; i < this.flow; i += 1) {
        const farLeft = matrix.particleAt(this.x - i, this.y);
        const farRight = matrix.particleAt(this.x + i, this.y);

        if (farLeft instanceof Air || farRight instanceof Air) {
          if (!hitAir) hitAir = true;
        }

        if (rand > 0.5 && ((left instanceof Air) || (left instanceof Smoke))) {
          matrix.swapParticles(this, farLeft);
        } else if (rand <= 0.5 && ((left instanceof Air) || (left instanceof Smoke))) {
          matrix.swapParticles(this, farRight);
        }

        if (hitAir) break;
      }
    }
  }
}

export default Smoke;
