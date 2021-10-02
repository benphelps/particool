// import GameMatrix from '../../GameMatrix';
import Config from '../../Config';
import GameMatrix from '../../GameMatrix';
import Air from '../Gasses/Air';
import Smoke from '../Gasses/Smoke';
import Water from '../Liquids/Water';
import Solid from '../Solid';

class Ember extends Solid {
  color: [number, number, number, number] = [240, 90, 60, 1];

  lifetime: number = 0.995;

  flow: number = 5;

  draw(context: CanvasRenderingContext2D) {
    const x = this.x * Config.scale;
    const y = this.y * Config.scale;

    // eslint-disable-next-line no-param-reassign
    // const bloom = 20 - ((new Date().getTime() - this.birth) / 1000) + (Math.random() * 2);

    if (this.replacedWith) {
      context.fillStyle = `rgba(${this.replacedWith.color[0]}, ${this.replacedWith.color[1]}, ${this.replacedWith.color[2]}, 1)`;
      context.fillRect(x, y, Config.scale, Config.scale);
    } else {
      context.fillStyle = 'rgba(99, 33, 20, 1)';
      context.fillRect(x, y, Config.scale, Config.scale);
    }

    context.shadowBlur = Math.random() * 10;
    context.shadowColor = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.color[2]})`;
    context.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0.5)`;
    context.fillRect(x, y, Config.scale, Config.scale);

    context.shadowBlur = 0;
    context.shadowColor = 'rgba(0,0,0,0)';
  }

  update(matrix: GameMatrix) {
    for (let reach = 1; reach < this.flow; reach += 1) {
      const down = matrix.particleAt(this.x, this.y + reach);
      const up = matrix.particleAt(this.x, this.y - reach);
      const left = matrix.particleAt(this.x - reach, this.y);
      const right = matrix.particleAt(this.x + reach, this.y);
      const leftDown = matrix.particleAt(this.x - reach, this.y + reach);
      const rightDown = matrix.particleAt(this.x + reach, this.y + reach);

      const chanceToBurn = Math.floor(Math.random() * 100);
      const chanceToJump = (chanceToBurn / 2.5) * Math.random();

      if (down && reach > 1 && chanceToJump < down.flameability) {
        break;
      }

      let extinguished = false;

      if (this.replacedWith) {
        if (down instanceof Water) {
          matrix.replaceParticleWith(this, this.replacedWith);
          extinguished = true;
        } else if (up instanceof Water) {
          matrix.replaceParticleWith(this, this.replacedWith);
          extinguished = true;
        } else if (left instanceof Water) {
          matrix.replaceParticleWith(this, this.replacedWith);
          extinguished = true;
        } else if (right instanceof Water) {
          matrix.replaceParticleWith(this, this.replacedWith);
          extinguished = true;
        } else if (leftDown instanceof Water) {
          matrix.replaceParticleWith(this, this.replacedWith);
          extinguished = true;
        } else if (rightDown instanceof Water) {
          matrix.replaceParticleWith(this, this.replacedWith);
          extinguished = true;
        }
      }

      if (extinguished) return;

      if (down && down.flamable && down.flameability >= chanceToBurn) {
        matrix.replaceParticle(down, Ember);
      } else if (up && up.flamable && up.flameability >= chanceToBurn) {
        matrix.replaceParticle(up, Ember);
      } else if (left && left.flamable && left.flameability >= chanceToBurn) {
        matrix.replaceParticle(left, Ember);
      } else if (right && right.flamable && right.flameability >= chanceToBurn) {
        matrix.replaceParticle(right, Ember);
      } else if (leftDown && leftDown.flamable && leftDown.flameability >= chanceToBurn) {
        matrix.replaceParticle(leftDown, Ember);
      } else if (rightDown && rightDown.flamable && rightDown.flameability >= chanceToBurn) {
        matrix.replaceParticle(rightDown, Ember);
      }
    }

    const up = matrix.particleAt(this.x, this.y - 1);
    const chanceToSmoke = Math.random();
    if (chanceToSmoke > 0.9 && (up instanceof Air)) {
      matrix.replaceParticle(up, Smoke);
    }

    const chanceToFizzle = Math.random();
    if (this.replacedWith) {
      if (chanceToFizzle > (this.lifetime - (this.replacedWith.flameability / 100))) {
        matrix.replaceParticle(this, Air);
      }
    } else if (chanceToFizzle > this.lifetime) {
      matrix.replaceParticle(this, Air);
    }
  }
}

export default Ember;
