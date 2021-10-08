import GameMatrix from '../../GameMatrix';
import Particle from '../Particle';
import Solid from '../Solid';

class Vine extends Solid {
  color: [number, number, number, number] = [172, 219, 151, 1];

  flow = 3;

  flameability = 50;

  flamable = true;

  corrodibility = 0.3;

  density = 0.99;

  length: number = 0;

  tip: boolean = false;

  static collidesWith(particle: Particle) {
    if (particle && ((particle instanceof Vine) || (particle instanceof Solid))) {
      return true;
    }

    return false;
  }

  static vinesAround(matrix: GameMatrix, particle: Particle) {
    let around = 0;

    if (!particle) return around;

    const up = matrix.particleAt(particle.x, particle.y - 1);
    const leftUp = matrix.particleAt(particle.x - 1, particle.y - 1);
    const rightUp = matrix.particleAt(particle.x + 1, particle.y - 1);
    const left = matrix.particleAt(particle.x - 1, particle.y);
    const right = matrix.particleAt(particle.x + 1, particle.y);
    const down = matrix.particleAt(particle.x, particle.y + 1);
    const leftDown = matrix.particleAt(particle.x - 1, particle.y + 1);
    const rightDown = matrix.particleAt(particle.x + 1, particle.y + 1);

    if (up instanceof Vine) around += 1;
    if (leftUp instanceof Vine) around += 1;
    if (rightUp instanceof Vine) around += 1;
    if (left instanceof Vine) around += 1;
    if (right instanceof Vine) around += 1;
    if (down instanceof Vine) around += 1;
    if (leftDown instanceof Vine) around += 1;
    if (rightDown instanceof Vine) around += 1;

    return around;
  }

  static solidsAround(matrix: GameMatrix, particle: Particle) {
    let around = 0;

    if (!particle) return around;

    const up = matrix.particleAt(particle.x, particle.y - 1);
    const leftUp = matrix.particleAt(particle.x - 1, particle.y - 1);
    const rightUp = matrix.particleAt(particle.x + 1, particle.y - 1);
    const left = matrix.particleAt(particle.x - 1, particle.y);
    const right = matrix.particleAt(particle.x + 1, particle.y);
    const down = matrix.particleAt(particle.x, particle.y + 1);
    const leftDown = matrix.particleAt(particle.x - 1, particle.y + 1);
    const rightDown = matrix.particleAt(particle.x + 1, particle.y + 1);

    if ((up instanceof Solid) && !(up instanceof Vine)) around += 1;
    if ((leftUp instanceof Solid) && !(leftUp instanceof Vine)) around += 1;
    if ((rightUp instanceof Solid) && !(rightUp instanceof Vine)) around += 1;
    if ((left instanceof Solid) && !(left instanceof Vine)) around += 1;
    if ((right instanceof Solid) && !(right instanceof Vine)) around += 1;
    if ((down instanceof Solid) && !(down instanceof Vine)) around += 1;
    if ((leftDown instanceof Solid) && !(leftDown instanceof Vine)) around += 1;
    if ((rightDown instanceof Solid) && !(rightDown instanceof Vine)) around += 1;

    return around;
  }

  randNeighbour(matrix: GameMatrix) {
    const randXDir = Math.random() < 0.5 ? 0 : 1;
    const randYDir = Math.random() < 0.5 ? 0 : 1;
    const randX = Math.random() < 0.5 ? -randXDir : randXDir;
    const randY = Math.random() < 0.5 ? -randYDir : randYDir;
    return matrix.particleAt(this.x + randX, this.y + randY);
  }

  update(matrix: GameMatrix) {
    if (!this.parent) {
      this.parent = this;
      this.tip = true;
    }

    const neighbourA = this.randNeighbour(matrix);
    const neighbourB = this.randNeighbour(matrix);

    if (this.tip) {
      let neighbour: Particle;

      if (Vine.solidsAround(matrix, neighbourA) > Vine.vinesAround(matrix, neighbourB)) {
        neighbour = neighbourA;
      } else {
        neighbour = neighbourB;
      }

      if (!Vine.collidesWith(neighbour) && Vine.vinesAround(matrix, neighbour) === 1) {
        const newTip = matrix.replaceParticleChild(neighbour, this.parent, Vine) as Vine;
        this.tip = false;
        if (newTip) newTip.tip = true;
      }
    }
  }
}

export default Vine;
