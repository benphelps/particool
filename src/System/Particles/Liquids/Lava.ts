import GameMatrix from '../../GameMatrix';
import Gas from '../Gas';
import Air from '../Gasses/Air';
import Steam from '../Gasses/Steam';
import Liquid from '../Liquid';
import Particle from '../Particle';
import Ember from '../Solids/Ember';
import Stone from '../Solids/Stone';
import Water from './Water';

class Lava extends Liquid {
  color: [number, number, number, number] = [138, 18, 18, 1];

  flow: number = 2;

  texturedIntensity = 0.85;

  static collidesWith(particle: Particle) {
    if (particle && ((particle instanceof Particle) && !(particle instanceof Gas))) {
      return true;
    }

    return false;
  }

  update(matrix: GameMatrix) {
    const down = matrix.particleAt(this.x, this.y + 1);
    const leftDown = matrix.particleAt(this.x - 1, this.y + 1);
    const rightDown = matrix.particleAt(this.x + 1, this.y + 1);

    if (!Lava.collidesWith(down)) {
      matrix.swapParticles(this, down);
    } else if (!Lava.collidesWith(leftDown)) {
      matrix.swapParticles(this, leftDown);
    } else if (!Lava.collidesWith(rightDown)) {
      matrix.swapParticles(this, rightDown);
    } else {
      const rand = Math.floor(Math.random() * 10);
      let hitAir = false;

      for (let i = 1; i < this.flow; i += 1) {
        const left = matrix.particleAt(this.x - i, this.y);
        const right = matrix.particleAt(this.x + i, this.y);
        const up = matrix.particleAt(this.x, this.y - i);

        if (left instanceof Air || right instanceof Air) {
          if (!hitAir) hitAir = true;
        }

        if (rand > 5 && !Lava.collidesWith(right)) {
          matrix.swapParticles(this, right);
        } else if (rand <= 5 && !Lava.collidesWith(left)) {
          matrix.swapParticles(this, left);
        }

        if (rand < 0.001 && (up instanceof Water)) {
          matrix.replaceParticle(up, Steam);
          // matrix.replaceParticle(this, Bubble);
        }

        if (rand >= 0.49 && rand <= 0.5 && (down instanceof Water)) {
          matrix.replaceParticle(down, Stone);
          // matrix.replaceParticle(this, Bubble);
        } else if (rand > 0.999 && (left instanceof Water)) {
          matrix.replaceParticle(left, Stone);
          // matrix.replaceParticle(this, Bubble);
        } else if (rand < 0.001 && (right instanceof Water)) {
          matrix.replaceParticle(right, Stone);
          // matrix.replaceParticle(this, Bubble);
        }

        if (hitAir) break;
      }
    }

    for (let reach = 1; reach < this.flow; reach += 1) {
      const downB = matrix.particleAt(this.x, this.y + reach);
      const up = matrix.particleAt(this.x, this.y - reach);
      const left = matrix.particleAt(this.x - reach, this.y);
      const right = matrix.particleAt(this.x + reach, this.y);

      const chanceToBurn = Math.floor(Math.random() * 100);
      const chanceToJump = (chanceToBurn / 2.5) * Math.random();

      if (reach > 1 && chanceToJump < downB.flameability) {
        break;
      }

      if (downB && downB.flamable && downB.flameability >= chanceToBurn) {
        matrix.replaceParticle(downB, Ember);
      } else if (up && up.flamable && up.flameability >= chanceToBurn) {
        matrix.replaceParticle(up, Ember);
      } else if (left && left.flamable && left.flameability >= chanceToBurn) {
        matrix.replaceParticle(left, Ember);
      } else if (right && right.flamable && right.flameability >= chanceToBurn) {
        matrix.replaceParticle(right, Ember);
      }
    }

    const up = matrix.particleAt(this.x, this.y - 1);
    const chanceToSteam = Math.random();
    if (chanceToSteam > 0.9 && (down instanceof Water)) {
      matrix.replaceParticle(up, Steam);
    }
  }
}

export default Lava;
