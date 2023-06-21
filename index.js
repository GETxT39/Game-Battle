const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1745;
canvas.height = 850;
c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./background.png",
  origin: false,
  object: { p: 100, y: 655, x1: 255, x2: 1000 },
});
const shop = new Sprite({
  position: {
    x: 1220,
    y: 322,
  },
  imageSrc: "./shop.png",
  scale: 3,
  framesMax: 6,
  width: 1260,
  height: 376,
  object: { p: 280, y: 450, x1: 1210, x2: 1530 },
});
const player = new Fighter({
  position_origin: 657,
  height_origin: 53,
  width_origin: 28,
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  color: "red",
  offset: { x: 30, y: 50 }, //200
  imageSrc: "./Idle1.png",
  scale: 1,
  framesMax: 8,
  attackBox: {
    width: 70, //-100
    height: 50,
  },
  offset_p: { x: 43, y: 70 },
  P: [{ p: 25, y: null, x1: null, x2: null }, shop.object, background.object],
  sprites: {
    Idle: {
      imageSrc: "./Idle1.png",
      framesMax: 8,
    },
    Run: {
      imageSrc: "./Run1.png",
      framesMax: 8,
    },
    Jump: {
      imageSrc: "./Jump1.png",
      framesMax: 2,
    },
    Fall: {
      imageSrc: "./Fall1.png",
      framesMax: 2,
    },
    Attack1: {
      imageSrc: "./Attack11.png",
      framesMax: 6,
    },
    Attack2: {
      imageSrc: "./Attack21.png",
      framesMax: 6,
    },
    TakeHit: {
      imageSrc: "./TakeHit1.png",
      framesMax: 4,
    },
    Death: {
      imageSrc: "./Death1.png",
      framesMax: 6,
    },
  },
});
const enemy = new Fighter({
  position_origin: 646.5,
  height_origin: 63.5,
  width_origin: 28,
  position: { x: 1600, y: 0 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: -70, y: 50 }, //110
  imageSrc: "./Idle.png",
  scale: 1,
  framesMax: 4,
  attackBox: {
    width: 70, //-115
    height: 50,
  },
  offset_p: { x: 43, y: 65 },
  P: [{ p: 25, y: null, x1: null, x2: null }, shop.object, background.object],
  sprites: {
    Idle: {
      imageSrc: "./Idle.png",
      framesMax: 4,
    },
    Run: {
      imageSrc: "./Run.png",
      framesMax: 8,
    },
    Jump: {
      imageSrc: "./Jump.png",
      framesMax: 2,
    },
    Fall: {
      imageSrc: "./Fall.png",
      framesMax: 2,
    },
    Attack1: {
      imageSrc: "./Attack1.png",
      framesMax: 4,
    },
    Attack2: {
      imageSrc: "./Attack2.png",
      framesMax: 4,
    },
    TakeHit: {
      imageSrc: "./TakeHit.png",
      framesMax: 3,
    },
    Death: {
      imageSrc: "./Death.png",
      framesMax: 7,
    },
  },
});
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  j: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  Enter: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
};

decreaseTimer();
function pause() {
  if (start) {
    animate();
  } else {
    window.requestAnimationFrame(pause);
  }
}
function animate() {
  if (start) {
    window.requestAnimationFrame(animate);
  } else {
    //keys.w.pressed = false;
    //keys.a.pressed = false;
    //keys.d.pressed = false;
    //keys.ArrowUp.pressed = false;
    //keys.ArrowRight.pressed = false;
    //keys.ArrowLeft.pressed = false;
    //keys.Enter.pressed = false;
    pause();
  }
  if (document.querySelector(".gameplay").style.display === "block" && end) {
    end = false;
    enemy.position.y = 0;
    player.position.y = 0;
  }
  //  c.clearRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.switchSprite("Run");
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.switchSprite("Run");
    player.velocity.x = 5;
  } else player.switchSprite("Idle");

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.switchSprite("Run");
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.switchSprite("Run");
    enemy.velocity.x = 5;
  } else enemy.switchSprite("Idle");
  if (keys.w.pressed) {
    P(player);
  }
  if (keys.ArrowUp.pressed) {
    P(enemy);
  }
  if (player.velocity.y < 0) {
    player.switchSprite("Jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("Fall");
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("Jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("Fall");
  }
  if (keys.j.pressed && !player.isAttacking && start && !player.dead) {
    player.attack();
  }
  if (keys.Enter.pressed && !enemy.isAttacking && start && !enemy.dead) {
    enemy.attack();
  }

  if (
    rectangularCollision(player, enemy) &&
    player.isAttacking &&
    (player.frameCurrent === 5 || 4) &&
    start
  ) {
    player.isAttacking = false;
    enemy.takehit();
    gsap.to(".P2", {
      width: enemy.health + "%",
    });
  }
  if (player.isAttacking && (player.frameCurrent === 5 || 4)) {
    player.isAttacking = false;
  }
  if (
    rectangularCollision(enemy, player) &&
    enemy.isAttacking &&
    (enemy.frameCurrent === 3 || 2) &&
    start
  ) {
    enemy.isAttacking = false;
    player.takehit();
    gsap.to(".P1", {
      width: player.health + "%",
    });
  }
  if (enemy.isAttacking && (enemy.frameCurrent === 3 || 2)) {
    enemy.isAttacking = false;
  }
  if (enemy.health <= 0) {
    determineWinner(player, enemy, timeout);
    enemy.dead = true;
  } else if (player.health <= 0) {
    player.dead = true;
    determineWinner(player, enemy, timeout);
  }
}
animate();

addEventListener("keydown", (e) => {
  if (start) {
    switch (e.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        keys.w.pressed = true;

        break;
      case "j":
        keys.j.pressed = true;

        break;

      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        keys.ArrowUp.pressed = true;
        break;
      case "Enter":
        keys.Enter.pressed = true;
        break;
    }
  }
});
addEventListener("keyup", (e) => {
  if (start) {
    switch (e.key) {
      case "d":
        keys.d.pressed = false;

        break;
      case "a":
        keys.a.pressed = false;

        break;
      case "w":
        keys.w.pressed = false;

        break;
      case "j":
        keys.j.pressed = false;
        break;

      case "ArrowLeft":
        keys.ArrowLeft.pressed = false;

        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = false;

        break;
      case "ArrowUp":
        keys.ArrowUp.pressed = false;

        break;
      case "Enter":
        keys.Enter.pressed = false;

        break;
    }
  }
});
