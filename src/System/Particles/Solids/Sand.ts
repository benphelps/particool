import GameMatrix from '../../GameMatrix';
import Air from '../Gasses/Air';
import Water from '../Liquids/Water';
import Particle from '../Particle';
import Solid from '../Solid';
import WetSand from './WetSand';

class Sand extends Solid {
  color: [number, number, number, number] = [245, 220, 147, 1];

  flow = 3;

  corrodibility = 0.3;

  texturedIntensity = 0.75;

  static collidesWith(particle: Particle) {
    if (particle && ((particle instanceof Solid) || (particle instanceof Sand)
    || (particle instanceof WetSand))) {
      return true;
    }

    return false;
  }

  update(matrix: GameMatrix) {
    const up = matrix.particleAt(this.x, this.y - 1);
    const down = matrix.particleAt(this.x, this.y + 1);
    const leftDown = matrix.particleAt(this.x - 1, this.y + 1);
    const rightDown = matrix.particleAt(this.x + 1, this.y + 1);

    if (up instanceof Water) {
      matrix.replaceParticle(up, WetSand);
      // matrix.replaceParticle(this, Air);
    }

    if (!Sand.collidesWith(down)) {
      if (down instanceof Water) {
        matrix.replaceParticle(down, WetSand);
        matrix.replaceParticle(this, Air);
      } else {
        matrix.swapParticles(this, down);
      }
    } else {
      const rand = Math.random();

      if (rand > 0.5 && !Sand.collidesWith(leftDown)) {
        if (leftDown instanceof Water) {
          matrix.replaceParticle(leftDown, WetSand);
          matrix.replaceParticle(this, Air);
        } else {
          matrix.swapParticles(this, leftDown);
        }
      } else if (rand <= 0.5 && !Sand.collidesWith(rightDown)) {
        if (rightDown instanceof Water) {
          matrix.replaceParticle(rightDown, WetSand);
          matrix.replaceParticle(this, Air);
        } else {
          matrix.swapParticles(this, rightDown);
        }
      }
    }
  }
}

export default Sand;
