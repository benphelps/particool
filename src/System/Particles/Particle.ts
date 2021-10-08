import { v4 as uuidv4 } from 'uuid';
import Config from '../Config';
import GameMatrix from '../GameMatrix';
import WebGL from '../WebGL';

class Particle {
    x: number = 0;

    y: number = 0;

    velocity: { x: number, y: number } = { x: 0, y: 0 };

    color: [number, number, number, number] = [255, 0, 255, 1];

    public density: number = 1;

    flow: number = 0;

    lifetime: number = Infinity;

    flameability: number = 0;

    flamable: boolean = false;

    corrodibility: number = -1;

    birth: number = 0;

    replacedWith: Particle;

    texturedAlpha: number;

    texturedIntensity: number = 0.9;

    uniqueId: string = uuidv4();

    parent: Particle;

    length: number;

    constructor(x: number, y: number, velocity: { x: number, y: number } = { x: 0, y: 0 }) {
      this.x = x;
      this.y = y;
      this.velocity = velocity;
      this.birth = new Date().getTime();
    }

    reset(x: number, y: number, velocity: { x: number, y: number } = { x: 0, y: 0 }) {
      this.x = x;
      this.y = y;
      this.velocity = velocity;
      this.uniqueId = uuidv4();
      this.parent = null;
      this.length = 0;
      this.replacedWith = null;
      this.birth = new Date().getTime();
    }

    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    update(matrix: GameMatrix) {
      // nothing
    }

    // eslint-disable-next-line no-unused-vars
    static collidesWith(_particle: Particle) {
      return false;
    }

    setPositionTo(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    swapPosition(b: Particle) {
      const ax = this.x;
      const ay = this.y;
      const bx = b.x;
      const by = b.y;

      this.setPositionTo(bx, by);
      b.setPositionTo(ax, ay);
    }

    draw(webgl: WebGL) {
      const x = this.x * Config.scale;
      const y = this.y * Config.scale;

      if (!this.texturedAlpha) {
        this.texturedAlpha = Math.random() + this.texturedIntensity;
        if (this.texturedAlpha > 1) this.texturedAlpha = 1;
      }

      webgl.setColor(
        this.color[0],
        this.color[1],
        this.color[2],
        this.color[3],
      );
      webgl.drawPixel(x, y);
    }
}

export default Particle;
