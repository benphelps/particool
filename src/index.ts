import './game.css';
import Game from './System/Game';

const game = new Game('game');
game.update(0);

// eslint-disable-next-line
const changeParticle = function(particle: any) {
  game.changeParticle(particle);
};

const global = (window) as any;
global.changeParticle = changeParticle;
