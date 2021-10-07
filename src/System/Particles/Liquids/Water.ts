import GameMatrix from '../../GameMatrix';
import Air from '../Gasses/Air';
import Liquid from '../Liquid';
import Particle from '../Particle';
import Solid from '../Solid';
import Gunpowder from '../Solids/Gunpowder';
import Obsidian from '../Solids/Obsidian';
import Sand from '../Solids/Sand';
import WetSand from '../Solids/WetSand';
import Lava from './Lava';

class Water extends Liquid {
  color: [number, number, number, number] = [86, 159, 227, 1];

  flow = 5;

  texturedIntensity = 0.85;

  static collidesWith(particle: Particle) {
    if (particle && ((particle instanceof Solid) || (particle instanceof Water)
    || (particle instanceof Sand) || (particle instanceof WetSand)
    || (particle instanceof Gunpowder))) {
      return true;
    }

    return false;
  }

  update(matrix: GameMatrix) {
    const up = matrix.particleAt(this.x, this.y - 1);
    const down = matrix.particleAt(this.x, this.y + 1);
    const leftDown = matrix.particleAt(this.x - 1, this.y + 1);
    const rightDown = matrix.particleAt(this.x + 1, this.y + 1);

    if (up instanceof Lava) {
      matrix.replaceParticle(up, Obsidian);
    }

    if (!Water.collidesWith(down)) {
      if (down instanceof Lava) {
        matrix.replaceParticle(down, Obsidian);
      } else {
        matrix.swapParticles(this, down);
      }
    } else if (!Water.collidesWith(leftDown)) {
      if (leftDown instanceof Lava) {
        matrix.replaceParticle(leftDown, Obsidian);
      } else {
        matrix.swapParticles(this, leftDown);
      }
    } else if (!Water.collidesWith(rightDown)) {
      if (rightDown instanceof Lava) {
        matrix.replaceParticle(rightDown, Obsidian);
      } else {
        matrix.swapParticles(this, rightDown);
      }
    } else {
      const rand = Math.floor(Math.random() * 10);
      let hitAir = false;

      for (let i = 1; i < this.flow; i += 1) {
        const left = matrix.particleAt(this.x - i, this.y);
        const right = matrix.particleAt(this.x + i, this.y);

        if (left instanceof Air || right instanceof Air) {
          if (!hitAir) hitAir = true;
        }

        if (rand > 5 && !Water.collidesWith(right)) {
          matrix.swapParticles(this, right);
        } else if (rand <= 5 && !Water.collidesWith(left)) {
          matrix.swapParticles(this, left);
        }

        // if (rand >= 0.49 && rand <= 0.5 && (down instanceof Sand)) {
        //   matrix.replaceParticle(down, WetSand);
        //   // matrix.replaceParticle(this, Bubble);
        // } else if (rand > 0.999 && (left instanceof Sand)) {
        //   matrix.replaceParticle(left, WetSand);
        //   // matrix.replaceParticle(this, Bubble);
        // } else if (rand < 0.001 && (right instanceof Sand)) {
        //   matrix.replaceParticle(right, WetSand);
        //   // matrix.replaceParticle(this, Bubble);
        // }

        if (hitAir) break;
      }
    }
  }
}

export default Water;
