console.warn("If you have problems please contact email: dongnguyenvie@gmail.com");
const client = io("http://localhost:3000", {
  //   path: '/'
});

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

const gameState = {
  players: {}
};
client.emit("newPlayer");

client.on("state", gameState => {
  console.log(Object.keys(gameState.players).length);
  //   cxt.fillRect(0, 0, 10000, 10000);
  for (let player in gameState.players) {
    drawPlayer(gameState.players[player]);
  }
});

const playerMovement = {
  up: false,
  down: false,
  left: false,
  right: false
};
const keyDownHandler = e => {
  if (e.keyCode == 39) {
    playerMovement.right = true;
  } else if (e.keyCode == 37) {
    playerMovement.left = true;
  } else if (e.keyCode == 38) {
    playerMovement.up = true;
  } else if (e.keyCode == 40) {
    playerMovement.down = true;
  }
};
const keyUpHandler = e => {
  if (e.keyCode == 39) {
    playerMovement.right = false;
  } else if (e.keyCode == 37) {
    playerMovement.left = false;
  } else if (e.keyCode == 38) {
    playerMovement.up = false;
  } else if (e.keyCode == 40) {
    playerMovement.down = false;
  }
};

setInterval(() => {
  client.emit("playerMovement", playerMovement);
}, 1000 / 60);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function drawPlayer(player) {
  ctx.beginPath();
  ctx.rect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
