import Gas from '../Gas';

class Air extends Gas {
  color: [number, number, number, number] = [255, 255, 255, 1];

  // update(matrix: GameMatrix) {
  //   const up = matrix.particleAt(this.x, this.y + 1);

  //   if (up && up.density > this.density) {
  //     matrix.swapParticles(this, up);
  //   }
  // }
}

export default Air;
