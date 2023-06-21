const gravity = 0.5;
let time = null;
let end = true;
let start = true;
const P1 = document.querySelector(".P1");
const P2 = document.querySelector(".P2");
const Etime = document.querySelector(".time");
const over = document.querySelector(".over");
let timeout;
class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    width = canvas.width,
    height = canvas.height,
    framesMax = 1,
    offset_p = { x: 0, y: 0 },
    origin = true,
    object,
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.height = height;
    this.width = width;
    this.scale = scale;
    this.framesMax = framesMax;
    this.frameCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset_p = offset_p;
    this.origin = origin;
    this.object = object;
  }
  draw() {
    if (this.origin) {
      c.drawImage(
        this.image,
        (this.image.width / this.framesMax) * this.frameCurrent,
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - this.offset_p.x,
        this.position.y - this.offset_p.y,
        (this.image.width / this.framesMax) * this.scale,
        this.image.height * this.scale
      );
    } else {
      //c.drawImage(
      //  this.image,
      //  (this.width / this.framesMax) * this.frameCurrent,
      //  0,
      //  this.width / this.framesMax,
      //  this.height,
      //  this.position.x - this.offset_p.x,
      //  this.position.y - this.offset_p.y,
      //  (this.width / this.framesMax) * this.scale,
      //  this.height * this.scale
      //);
      c.drawImage(
        this.image,
        this.position.x - this.offset_p.x,
        this.position.y - this.offset_p.y,
        (this.width / this.framesMax) * this.scale,
        this.height * this.scale
      );
    }
  }
  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.frameCurrent < this.framesMax - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }
  update() {
    this.draw();
    this.animateFrames();
  }
}
class Fighter extends Sprite {
  constructor({
    position_origin = 657,
    height_origin = 53,
    width_origin = 28,
    position,
    velocity,
    color,
    offset,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset_p = { x: 0, y: 0 },
    sprites,
    attackBox = {
      width: undefined,
      height: undefined,
    },
    P = [
      { p: 25, y: null, x1: null, x2: null },
      { p: 280, y: 480, x1: 1210, x2: 1530 },
      { p: 100, y: 640, x1: 275, x2: 1000 },
    ],
  }) {
    super({
      offset_p,
      position,
      imageSrc,
      scale,
      framesMax,
    });
    this.position_origin = position_origin;
    this.position = { x: position.x + offset_p.x, y: position.y + offset_p.y };
    this.image = new Image();
    this.image.src = imageSrc;
    this.color = color;
    this.velocity = velocity;
    this.height = this.image.height - 2.1 * offset_p.y;
    this.height_origin = height_origin;
    this.width = this.image.width / framesMax - 4 * offset_p.x;
    this.width_origin = width_origin;

    this.lastKey;
    this.isAttacking = false;
    this.health = 100;
    this.attackBox = {
      position: { x: position.x + 2 * offset_p.x, y: position.y },
      offset: offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.frameCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset_p;
    this.sprites = sprites;
    this.dead = false;
    this.P = P[0].p;
    this.Ps = P;
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    //c.fillRect(
    //  this.attackBox.position.x + this.offset_p.x,
    //  this.attackBox.position.y,
    //  this.attackBox.width,
    //  this.attackBox.height
    //);
    //c.fillRect(
    //  this.position.x + this.offset_p.x,
    //  this.position.y,
    //  this.width,
    //  this.height
    //);

    if (this.position.x + this.offset_p.x <= -this.offset_p.x + 20) {
      this.position.x = canvas.width - 2 * this.offset_p.x + 10;
    } else if (this.position.x + this.offset_p.x + 10 >= canvas.width) {
      this.position.x = 0 - this.offset_p.x;
    }
    if (
      this.image === this.sprites.Attack1.image &&
      this.frameCurrent < this.sprites.Attack1.framesMax - 1
    ) {
      this.velocity.x = 0;
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //this.jump_object();
    //console.log(this.position.y + this.height);

    //if (this.position.y >= this.position_origin) {
    //  this.position.y = this.position_origin;
    //  this.height = this.height_origin;
    //  this.width = this.width_origin;
    //}
    //console.log(this.width);
    //console.log(this.height);
    console.log(this.position.y);
    if (this.position.y + this.height >= canvas.height - 120 - this.P) {
      this.velocity.y = 0;
      if (this.P === this.Ps[0].p) {
        this.position.y = 710 - this.height;
      }
    } else {
      this.velocity.y += gravity;
    }
    this.Ps.map((i) => {
      setTimeout(() => {
        if (
          this.position.y + this.height <= i.y &&
          this.position.x + this.width >= i.x1 &&
          this.position.x + this.width <= i.x2 &&
          this.P === this.Ps[0].p
        ) {
          setTimeout(() => {
            if (this.P !== i.p) {
              this.P = i.p;
            }
          }, 0);
        } else {
          if (this.P !== this.Ps[0].p) {
            this.P = this.Ps[0].p;
          }
        }
      }, 0);
    });
  }
  attack() {
    if (this.velocity.y !== 0) {
      this.switchSprite("Attack2");
    } else {
      this.switchSprite("Attack1");
    }
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
  takehit() {
    this.isAttacking = false;
    this.health = this.health - 0.5;
    if (this.health <= 0) {
      this.switchSprite("Death");
    } else {
      this.switchSprite("TakeHit");
    }
  }
  jump_object() {
    for (let i = 1; i < this.Ps.length; i++) {
      setTimeout(() => {
        if (
          this.position.y + this.height <= this.Ps[i].y &&
          this.position.x + this.width >= this.Ps[i].x1 &&
          this.position.x + this.width <= this.Ps[i].x2 &&
          this.P === this.Ps[0].p
        ) {
          setTimeout(() => {
            this.P = this.Ps[i].p;
          }, 500);
        } else {
          if (this.P !== this.Ps[0].p) {
            this.P = this.Ps[0].p;
          }
        }
      }, 0);
    }
  }
  switchSprite(sprite) {
    if (
      this.image === this.sprites.Attack1.image &&
      this.frameCurrent < this.sprites.Attack1.framesMax - 1
    ) {
      return;
    }
    if (
      this.image === this.sprites.Attack2.image &&
      this.frameCurrent < this.sprites.Attack2.framesMax - 1
    ) {
      return;
    }
    if (
      this.image === this.sprites.TakeHit.image &&
      this.frameCurrent < this.sprites.TakeHit.framesMax - 1
    ) {
      return;
    }
    if (this.image === this.sprites.Death.image) {
      if (this.frameCurrent === this.framesMax - 1) start = false;
      return;
    }
    switch (sprite) {
      case "Idle":
        if (this.image !== this.sprites[sprite].image) {
          this.image = this.sprites[sprite].image;
          this.frameCurrent = 0;
          this.framesMax = this.sprites[sprite].framesMax;
        }
        break;
      case "Run":
        if (this.image !== this.sprites[sprite].image) {
          this.image = this.sprites[sprite].image;
          this.frameCurrent = 0;
          this.framesMax = this.sprites[sprite].framesMax;
        }
        break;
      case "Jump":
        if (this.image !== this.sprites[sprite].image) {
          this.image = this.sprites[sprite].image;
          this.frameCurrent = 0;
          this.framesMax = this.sprites[sprite].framesMax;
        }
        break;
      case "Fall":
        if (this.image !== this.sprites[sprite].image) {
          this.image = this.sprites[sprite].image;
          this.frameCurrent = 0;
          this.framesMax = this.sprites[sprite].framesMax;
        }
        break;
      case "Attack1":
        if (this.image !== this.sprites[sprite].image) {
          this.image = this.sprites[sprite].image;
          this.frameCurrent = 0;
          this.framesMax = this.sprites[sprite].framesMax;
        }
        break;
      case "Attack2":
        if (this.image !== this.sprites[sprite].image) {
          this.image = this.sprites[sprite].image;
          this.frameCurrent = 0;
          this.framesMax = this.sprites[sprite].framesMax;
        }
        break;
      case "TakeHit":
        if (this.image !== this.sprites[sprite].image) {
          this.image = this.sprites[sprite].image;
          this.frameCurrent = 0;
          this.framesMax = this.sprites[sprite].framesMax;
        }
        break;
      case "Death":
        if (this.image !== this.sprites[sprite].image) {
          this.image = this.sprites[sprite].image;
          this.frameCurrent = 0;
          this.framesMax = this.sprites[sprite].framesMax;
        }
        break;
    }
  }
}
