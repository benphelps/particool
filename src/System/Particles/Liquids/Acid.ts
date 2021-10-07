import GameMatrix from '../../GameMatrix';
import Gas from '../Gas';
import Air from '../Gasses/Air';
import Steam from '../Gasses/Steam';
import Liquid from '../Liquid';
import Particle from '../Particle';
import Water from './Water';

class Acid extends Liquid {
  color: [number, number, number, number] = [139, 196, 79, 255];

  flow: number = 5;

  static collidesWith(particle: Particle) {
    if (particle && (((particle instanceof Particle) && !(particle instanceof Gas))
    || (particle instanceof Acid))) {
      return true;
    }

    return false;
  }

  update(matrix: GameMatrix) {
    const down = matrix.particleAt(this.x, this.y + 1);
    const leftDown = matrix.particleAt(this.x - 1, this.y + 1);
    const rightDown = matrix.particleAt(this.x + 1, this.y + 1);

    if (!Acid.collidesWith(down)) {
      matrix.swapParticles(this, down);
    } else if (!Acid.collidesWith(leftDown)) {
      matrix.swapParticles(this, leftDown);
    } else if (!Acid.collidesWith(rightDown)) {
      matrix.swapParticles(this, rightDown);
    } else {
      const rand = Math.floor(Math.random() * 10);
      let hitAir = false;

      for (let i = 1; i < this.flow; i += 1) {
        const left = matrix.particleAt(this.x - i, this.y);
        const right = matrix.particleAt(this.x + i, this.y);

        if (!hitAir) {
          if (rand > 5 && !Acid.collidesWith(right)) {
            matrix.swapParticles(this, right);
          } else if (rand <= 5 && !Acid.collidesWith(left)) {
            matrix.swapParticles(this, left);
          }

          if (left instanceof Air || right instanceof Air) {
            if (!hitAir) hitAir = true;
          }
        }

        if (hitAir) break;
      }
    }

    for (let reach = 1; reach <= this.flow; reach += 1) {
      const downB = matrix.particleAt(this.x, this.y + reach);
      const up = matrix.particleAt(this.x, this.y - reach);
      const left = matrix.particleAt(this.x - reach, this.y);
      const right = matrix.particleAt(this.x + reach, this.y);

      const chanceToDissolve = Math.floor(Math.random() * 100);

      if (downB && downB.corrodibility >= chanceToDissolve) {
        matrix.replaceParticle(downB, Air);
        // matrix.replaceParticle(this, Air);
      } else if (up && up.corrodibility >= chanceToDissolve) {
        matrix.replaceParticle(up, Air);
        // matrix.replaceParticle(this, Air);
      } else if (left && left.corrodibility >= chanceToDissolve) {
        matrix.replaceParticle(left, Air);
        // matrix.replaceParticle(this, Air);
      } else if (right && right.corrodibility >= chanceToDissolve) {
        matrix.replaceParticle(right, Air);
        // matrix.replaceParticle(this, Air);
      }
    }

    const chanceToSteam = Math.random();
    if (chanceToSteam > 0.9 && (down instanceof Water)) {
      matrix.replaceParticle(down, Steam);
      matrix.replaceParticle(this, Air);
    }
  }
}

export default Acid;
