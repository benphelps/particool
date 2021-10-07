// import GameMatrix from '../../GameMatrix';
import Config from '../../Config';
import Solid from '../Solid';

class Wood extends Solid {
  color: [number, number, number, number] = [133, 101, 77, 1];

  colorDark: [number, number, number, number] = [130, 98, 74, 1];

  flameability: number = 12;

  flamable: boolean = true;

  corrodibility: number = 0.005;

  draw(context: CanvasRenderingContext2D) {
    const x = this.x * Config.scale;
    const y = this.y * Config.scale;
    let striped = false;

    if (!this.texturedAlpha) {
      this.texturedAlpha = Math.random() + 0.85;
    }

    if (this.y % 4 === 0 || this.y % 5 === 0) {
      striped = true;
    }

    if (striped) {
      // eslint-disable-next-line no-param-reassign
      context.fillStyle = `rgba(${this.colorDark[0]}, ${this.colorDark[1]}, ${this.colorDark[2]}, ${this.colorDark[3] === 1 ? this.texturedAlpha : this.colorDark[3]})`;
      context.fillRect(x, y, Config.scale, Config.scale);
    } else {
      // eslint-disable-next-line no-param-reassign
      context.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.color[3] === 1 ? this.texturedAlpha : this.color[3]})`;
      context.fillRect(x, y, Config.scale, Config.scale);
    }
  }

  // update(matrix: GameMatrix) {
  //   const down = matrix.particleAt(this.x, this.y + 1);
  //   const leftDown = matrix.particleAt(this.x - 1, this.y + 1);
  //   const rightDown = matrix.particleAt(this.x + 1, this.y + 1);
  // }
}

export default Wood;
