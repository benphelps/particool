import Air from './Particles/Gasses/Air';
import Particle from './Particles/Particle';
import Stone from './Particles/Solids/Stone';

class GameMatrix {
  public matrix: Array<Particle>;

  public width: number;

  public height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.matrix = new Array<Particle>(this.width * this.height);

    for (let index = 0; index < this.matrix.length; index += 1) {
      const [x, y] = this.coordAt(index);

      if (x === 0 || y === 0 || x === (this.width - 1) || y === (this.width - 1)) {
        this.matrix[index] = new Stone(x, y, [0, 0]);
      } else {
        this.matrix[index] = new Air(x, y, [0, 0]);
      }
    }
  }

  update() {
    // eslint-disable-next-line
    for (let index = this.matrix.length; index >= 0; index--) {
      const particle = this.matrix[index];
      if (particle && particle.density >= 1) {
        this.matrix[index].update(this);
      }
    }

    // eslint-disable-next-line
    for (let index = 0; index <= this.matrix.length; index++) {
      const particle = this.matrix[index];
      if (particle && particle.density < 1) {
        this.matrix[index].update(this);
      }
    }
  }

  draw(context: CanvasRenderingContext2D) {
    this.matrix.forEach((particle) => { if (particle) { particle.draw(context); } });
  }

  indexAt(x: number, y: number): number {
    return x + (y * this.width);
  }

  coordAt(index: number) {
    return [Math.floor(index % this.width), Math.floor(index / this.width)];
  }

  replaceParticle(a: Particle, ParticleType: typeof Particle) {
    const newParticle = new ParticleType(a.x, a.y, a.velocity);
    newParticle.replacedWith = a;
    this.matrix[this.indexAt(a.x, a.y)] = newParticle;
  }

  replaceParticleWith(a: Particle, b: Particle) {
    this.matrix[this.indexAt(a.x, a.y)] = b;
  }

  swapParticles(a: Particle, b: Particle) {
    if (!a || !b) return;
    if (a === b) return;

    const particleA = this.matrix[this.indexAt(a.x, a.y)];
    const particleB = this.matrix[this.indexAt(b.x, b.y)];
    this.setParticleAt(a.x, a.y, particleB);
    this.setParticleAt(b.x, b.y, particleA);

    if (a.x > 0 && a.x <= this.width && a.y > 0 && a.y <= this.height) {
      if (b.x > 0 && b.x <= this.width && b.y > 0 && b.y <= this.height) {
        a.swapPosition(b);
      }
    }
  }

  swapParticlesAt(xA: number, yA: number, xB: number, yB: number) {
    const particleA = this.matrix[this.indexAt(xA, yA)];
    const particleB = this.matrix[this.indexAt(xB, yB)];
    this.setParticleAt(xA, yA, particleB);
    this.setParticleAt(xB, yB, particleA);
  }

  setParticleAt(x: number, y: number, particle: Particle) {
    if (x > 0 && x <= this.width && y > 0 && y <= this.height) {
      this.matrix[this.indexAt(x, y)] = particle;
    }
  }

  newParticleAt(x: number, y: number, ParticleType: typeof Particle) {
    const existing = this.particleAt(x, y);
    if (!(existing instanceof ParticleType)) {
      if (x > 0 && x <= this.width && y > 0 && y <= this.height) {
        this.setParticleAt(
          x,
          y,
          new ParticleType(x, y),
        );
      }
    }
  }

  particleAt(x: number, y: number): Particle {
    return this.matrix[this.indexAt(x, y)];
  }
}

export default GameMatrix;
