import Solid from '../Solid';

class Stone extends Solid {
  color: [number, number, number, number] = [153, 149, 141, 1];

  flow: 0;

  corrodibility: number = 0.0005;

  texturedIntensity = 0.8;
}

export default Stone;
