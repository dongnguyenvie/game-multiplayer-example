const gameState = {
  players: {}
};
let layout = {
  width: 0,
  height: 0
}
const event = io => {
  io.on("connection", socket => {
    console.log("a user connected:", socket.id);
    socket.on("newPlayer", ({ width, height }) => {
      layout = {
        width,
        height
      }
      gameState.players[socket.id] = {
        x: createLocation(250),
        y: createLocation(250),
        width: 25,
        height: 25,
        color: getColor()
      };
    });

    socket.on("playerMovement", playerMovement => {
      const player = gameState.players[socket.id];
      // const canvasWidth = 480;
      // const canvasHeight = 320;
      const canvasWidth = layout.width;
      const canvasHeight = layout.height;

      if (playerMovement.left && player.x > 0) {
        player.x -= 4;
      }
      if (playerMovement.right && player.x < canvasWidth - player.width) {
        player.x += 4;
      }

      if (playerMovement.up && player.y > 0) {
        player.y -= 4;
      }
      if (playerMovement.down && player.y < canvasHeight - player.height) {
        player.y += 4;
      }
    });

    socket.on("disconnect", function () {
      console.log("user disconnected", socket.id);
      delete gameState.players[socket.id];
    });
  });

  setInterval(() => {
    io.sockets.emit("state", gameState);
  }, 1000 / 60);
};

module.exports = event;

function createLocation(point) {
  return Math.ceil(Math.random() * point);
}

function getColor() {
  return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)
}