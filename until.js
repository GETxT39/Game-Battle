function rectangularCollision(atk, def) {
  return (
    atk.attackBox.position.x + atk.attackBox.width >= def.position.x &&
    atk.attackBox.position.x <= def.position.x + def.width &&
    atk.attackBox.position.y + atk.attackBox.height >= def.position.y &&
    atk.attackBox.position.y <= def.position.y + def.height &&
    atk.isAttacking
  );
}
function determineWinner(player, enemy, timeout) {
  clearTimeout(timeout);
  over.style.display = "flex";

  if (player.health === enemy.health) {
    start = false;
    over.textContent = "Draw";
  } else if (player.health < enemy.health) {
    player.switchSprite("Death");
    over.textContent = "P2 Win";
  } else if (player.health > enemy.health) {
    enemy.switchSprite("Death");
    over.textContent = "P1 Win";
  }
}
function decreaseTimer() {
  if (time) {
    timeout = setTimeout(decreaseTimer, 1000);
    over.style.display = "none";
    time = time - 1;
    Etime.textContent = time;
    if (time === 0) {
      determineWinner(player, enemy, timeout);
    }
  } else {
    Etime.textContent = "";
  }
}
function P(player) {
  if (player.position.y + player.height >= canvas.height - player.P - 120) {
    player.velocity.y = -20;
  }
}
