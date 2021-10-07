import Solid from '../Solid';

class Stone extends Solid {
  color: [number, number, number, number] = [153, 149, 141, 255];

  flow: 0;

  corrodibility: number = 0.01;
}

export default Stone;
