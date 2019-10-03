console.warn("If you have problems please contact email: dongnguyenvie@gmail.com");
const urlParams = new URLSearchParams(window.location.search);
const PORT = urlParams.get('port');
const isDev = location.hostname === 'localhost' ? true : false
const client = io(`:${isDev ? 3000 : 80}`, {
  //   path: '/'
});

// const c = document.getElementById("canvas");
// const ctx = c.getContext("2d");
$( document ).ready(function() {
  class Canvas {
    constructor() {
      this.c = document.getElementById("canvas");
      this.ctx = this.c.getContext("2d");
    }

    setSizeAutomatically() {
      this.c.width = window.innerWidth;
      this.c.height = window.innerHeight;
    }

    getWidth() {
      return this.c.width;
    }

    getHeight() {
      return this.c.height;
    }
  }
  const layout = new Canvas();
  layout.setSizeAutomatically();

  client.emit("newPlayer", {width: layout.getWidth(), height: layout.getHeight() });

  client.on("state", gameState => {
    layout.ctx.clearRect(0, 0, layout.getWidth(), layout.getHeight());
  
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
    layout.ctx.beginPath();
    layout.ctx.arc(player.x, player.y,player.width , 0,2*Math.PI);
    layout.ctx.fillStyle = player.color;
    layout.ctx.fill();
    layout.ctx.closePath();
  }

});

