// import GameMatrix from '../../GameMatrix';
import Solid from '../Solid';

class Wood extends Solid {
  color: [number, number, number, number] = [133, 101, 77, 255];

  flameability: number = 12;

  flamable: boolean = true;

  // update(matrix: GameMatrix) {
  //   const down = matrix.particleAt(this.x, this.y + 1);
  //   const leftDown = matrix.particleAt(this.x - 1, this.y + 1);
  //   const rightDown = matrix.particleAt(this.x + 1, this.y + 1);
  // }
}

export default Wood;
