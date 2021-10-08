import Particle from './Particle';

class ParticleFactory {
  static freeParticles: { [type: string]: Particle[]; } = {};

  static usedParticles: { [type: string]: Particle[]; } = {};

  static used: number = 0;

  static free: number = 0;

  static getParticle(
    T: typeof Particle,
    x: number, y: number,
    velocity: { x: number, y: number } = { x: 0, y: 0 },
  ) {
    const particleType = T.name;
    if (!(particleType in ParticleFactory.freeParticles)) {
      ParticleFactory.freeParticles[particleType] = [];
    }
    if (!(particleType in ParticleFactory.usedParticles)) {
      ParticleFactory.usedParticles[particleType] = [];
    }
    const free = ParticleFactory.freeParticles[particleType].pop();

    if (free) {
      ParticleFactory.free -= 1;
      ParticleFactory.used += 1;
      ParticleFactory.usedParticles[particleType].push(free);
      free.reset(x, y, velocity);
      return free;
    }

    const fresh = new T(x, y, velocity);
    ParticleFactory.usedParticles[particleType].push(fresh);
    ParticleFactory.used += 1;
    return fresh;
  }

  static freeParticle(particle: Particle) {
    const particleType = particle.constructor.name.toString();

    const index = ParticleFactory.usedParticles[particleType].indexOf(particle);

    if (index > -1) {
      const particles = ParticleFactory.usedParticles[particleType].splice(index, 1);
      ParticleFactory.freeParticles[particleType].push(particles[0]);
      ParticleFactory.free += 1;
      ParticleFactory.used -= 1;
      return true;
    }
    return false;
  }
}

export default ParticleFactory;
