import Air from './Particles/Gasses/Air';
import Particle from './Particles/Particle';
import ParticleFactory from './Particles/ParticleFactory';
import WebGL from './WebGL';

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
      this.matrix[index] = ParticleFactory.getParticle(Air, x, y);
    }
  }

  update() {
    for (let index = this.matrix.length; index >= 0; index -= 1) {
      const particle = this.matrix[index];
      if (particle && particle.density >= 1) {
        this.matrix[index].update(this);
      }
    }

    for (let index = 0; index <= this.matrix.length; index += 1) {
      const particle = this.matrix[index];
      if (particle && particle.density < 1) {
        this.matrix[index].update(this);
      }
    }
  }

  draw(webgl: WebGL) {
    this.matrix.forEach((particle) => { if (particle) { particle.draw(webgl); } });
  }

  indexAt(x: number, y: number): number {
    if (x >= 0 && x <= this.width && y >= 0 && y <= this.height) return x + (y * this.width);
    return null;
  }

  coordAt(index: number) {
    return [Math.floor(index % this.width), Math.floor(index / this.width)];
  }

  replaceParticle(a: Particle, ParticleType: typeof Particle) {
    if (!(a instanceof Particle)) return;

    const index = this.indexAt(a.x, a.y);
    if (!index) return;

    const existing = this.particleAt(a.x, a.y);

    ParticleFactory.freeParticle(existing);
    const newParticle = ParticleFactory.getParticle(ParticleType, a.x, a.y, a.velocity);
    newParticle.replacedWith = a;
    this.matrix[index] = newParticle;
  }

  replaceParticleChild(a: Particle, parent: Particle, ParticleType: typeof Particle) : Particle {
    if (!(a instanceof Particle)) return null;

    const index = this.indexAt(a.x, a.y);
    if (!index) return null;

    const newParticle = ParticleFactory.getParticle(ParticleType, a.x, a.y, a.velocity);
    newParticle.parent = a;
    newParticle.replacedWith = a;
    this.matrix[index] = newParticle;

    ParticleFactory.freeParticle(a);

    return newParticle;
  }

  replaceParticleWith(a: Particle, b: Particle) {
    if (!(a instanceof Particle)) return;
    if (!(b instanceof Particle)) return;

    const index = this.indexAt(a.x, a.y);
    if (!index) return;
    this.matrix[index] = b;
    ParticleFactory.freeParticle(a);
  }

  swapParticles(a: Particle, b: Particle) {
    if (!(a instanceof Particle)) return;
    if (!(b instanceof Particle)) return;

    const particleA = this.matrix[this.indexAt(a.x, a.y)];
    const particleB = this.matrix[this.indexAt(b.x, b.y)];
    this.setParticleAt(a.x, a.y, particleB);
    this.setParticleAt(b.x, b.y, particleA);

    a.swapPosition(b);
  }

  swapParticlesAt(xA: number, yA: number, xB: number, yB: number) {
    const particleA = this.matrix[this.indexAt(xA, yA)];
    const particleB = this.matrix[this.indexAt(xB, yB)];
    this.setParticleAt(xA, yA, particleB);
    this.setParticleAt(xB, yB, particleA);
  }

  setParticleAt(x: number, y: number, particle: Particle) {
    if (x >= 0 && x <= this.width && y >= 0 && y <= this.height) {
      this.matrix[this.indexAt(x, y)] = particle;
    }
  }

  newParticleAt(x: number, y: number, ParticleType: typeof Particle) {
    const existing = this.particleAt(x, y);
    if (!(existing instanceof ParticleType)) {
      this.replaceParticle(existing, ParticleType);
    }
  }

  particleAt(x: number, y: number): Particle {
    const index = this.indexAt(x, y);
    if (index) return this.matrix[this.indexAt(x, y)];
    return null;
  }
}

export default GameMatrix;
