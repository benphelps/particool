import Config from './Config';
import GameMatrix from './GameMatrix';
// import Air from './Particles/Gasses/Air';
import Smoke from './Particles/Gasses/Smoke';
import Lava from './Particles/Liquids/Lava';
import Water from './Particles/Liquids/Water';
import Ember from './Particles/Solids/Ember';
import Gunpowder from './Particles/Solids/Gunpowder';
import Sand from './Particles/Solids/Sand';
import Stone from './Particles/Solids/Stone';
import Wood from './Particles/Solids/Wood';

class Game {
  private canvas: HTMLCanvasElement;

  private context: CanvasRenderingContext2D;

  public matrix: GameMatrix;

  private isDrawing = false;

  private CurrentParticle = Water;

  private mouseX = 0;

  private mouseY = 0;

  private drawingRadius = 4;

  constructor(element: string) {
    this.canvas = document.getElementById(element) as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.matrix = new GameMatrix(Config.width, Config.height);

    this.canvas.width = Config.width * Config.scale;
    this.canvas.height = Config.height * Config.scale;

    this.setupEvents();
  }

  setupEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.mouseX = Math.floor(e.offsetX / Config.scale);
      this.mouseY = Math.floor(e.offsetY / Config.scale);
      this.isDrawing = true;
    });

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();

      const t = e.touches[0];
      const rect = (t.target as HTMLElement).getBoundingClientRect();
      const x = t.pageX - rect.left;
      const y = t.pageY - rect.top;

      this.mouseX = Math.floor(x / Config.scale);
      this.mouseY = Math.floor(y / Config.scale);
      this.isDrawing = true;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();

      const t = e.touches[0];
      const rect = (t.target as HTMLElement).getBoundingClientRect();
      const x = t.pageX - rect.left;
      const y = t.pageY - rect.top;

      this.mouseX = Math.floor(x / Config.scale);
      this.mouseY = Math.floor(y / Config.scale);
    });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.isDrawing = false;
    });

    this.canvas.addEventListener('touchcancel', (e) => {
      e.preventDefault();

      const t = e.touches[0];
      const rect = (t.target as HTMLElement).getBoundingClientRect();
      const x = t.pageX - rect.left;
      const y = t.pageY - rect.top;

      this.mouseX = Math.floor(x / Config.scale);
      this.mouseY = Math.floor(y / Config.scale);
      this.isDrawing = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.mouseX = Math.floor(e.offsetX / Config.scale);
      this.mouseY = Math.floor(e.offsetY / Config.scale);
    });

    this.canvas.addEventListener('mouseup', (e) => {
      this.mouseX = Math.floor(e.offsetX / Config.scale);
      this.mouseY = Math.floor(e.offsetY / Config.scale);
      this.isDrawing = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      const scale = e.deltaY * -0.01;
      this.drawingRadius = Math.floor(this.drawingRadius + scale);
    });
  }

  changeParticle(particle: string) {
    if (particle === 'stone') {
      this.CurrentParticle = Stone;
    } else if (particle === 'water') {
      this.CurrentParticle = Water;
    } else if (particle === 'sand') {
      this.CurrentParticle = Sand;
    } else if (particle === 'smoke') {
      this.CurrentParticle = Smoke;
    } else if (particle === 'wood') {
      this.CurrentParticle = Wood;
    } else if (particle === 'ember') {
      this.CurrentParticle = Ember;
    } else if (particle === 'lava') {
      this.CurrentParticle = Lava;
    } else if (particle === 'gunpowder') {
      this.CurrentParticle = Gunpowder;
    }
  }

  placeParticle(x: number, y: number) {
    this.matrix.newParticleAt(Math.floor(x), Math.floor(y), this.CurrentParticle);
  }

  // drawCircle(x: number, y: number) {
  //   for (let r = 0; r < this.drawingRadius; r += 1) {
  //     for (let t = 0; t < 360; t += 1) {
  //       const pX = Math.ceil(x + r * Math.cos(t));
  //       const pY = Math.ceil(y + r * Math.sin(t));
  //       this.placeParticle(pX, pY);
  //     }
  //   }
  // }

  // ellipsePoints(x0: number, y0: number, x: number, y: number) {
  //   this.placeParticle(x0 + x, y0 + y);
  //   this.placeParticle(x0 - x, y0 + y);
  //   this.placeParticle(x0 + x, y0 - y);
  //   this.placeParticle(x0 - x, y0 - y);
  // }

  // drawCircle(x0: number, y0: number) {
  //   for (let r = 0; r < this.drawingRadius; r += 1) {
  //     let d = 5 - 4 * r;

  //     let x = 0;
  //     let y = r;

  //     let deltaA = (-2 * r + 5) * 4;
  //     let deltaB = 3 * 4;

  //     while (x <= y) {
  //       this.ellipsePoints(x0, y0, x, y);
  //       this.ellipsePoints(x0, y0, y, x);

  //       if (d > 0) {
  //         d += deltaA;

  //         y -= 1;
  //         x += 1;

  //         deltaA += 4 * 4;
  //         deltaB += 2 * 2;
  //       } else {
  //         d += deltaB;

  //         x += 1;

  //         deltaA += 2 * 4;
  //         deltaB += 2 * 4;
  //       }
  //     }
  //   }
  // }

  drawCircle(cx: number, cy: number) {
    const radius = this.drawingRadius;
    for (let y = -radius; y <= radius; y += 1) {
      for (let x = -radius; x <= radius; x += 1) {
        if (x * x + y * y <= radius * radius) {
          this.placeParticle(cx + x, cy + y);
        }
      }
    }
  }

  drawCursor(cx: number, cy: number) {
    const radius = this.drawingRadius;
    for (let y = -radius; y <= radius; y += 1) {
      for (let x = -radius; x <= radius; x += 1) {
        if (x * x + y * y <= radius * radius) {
          this.context.fillStyle = 'rgba(0, 0, 0, 0.2)';
          this.context.fillRect(
            (cx + x) * Config.scale, (cy + y) * Config.scale, Config.scale, Config.scale,
          );
        }
      }
    }
  }

  possiblyDrawPixel(i: number, j: number, r: number, cx: number, cy: number) {
    if (Math.round(Math.sqrt(i * i + j * j)) === r) {
      this.placeParticle(i + cx, j + cy);
      return true;
    }
    return false;
  }

  // eslint-disable-next-line
  update(timestamp) {
    if (this.isDrawing === true) {
      this.drawCircle(this.mouseX, this.mouseY);
    }

    // if (timestamp % 4) {
    this.matrix.update();
    // }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.context.fillStyle = 'black';
    // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.matrix.draw(this.context);

    this.drawCursor(this.mouseX, this.mouseY);

    window.requestAnimationFrame((ts) => this.update(ts));
  }
}

export default Game;
