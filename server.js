const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const http = require("http").createServer(app);

app.use("/static", express.static("static"));

// created socket.io
const io = require("socket.io")(http);
require("./event.js")(io);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/template/index.html");
});

http.listen(PORT, () => {
  console.log("listening on *:3000");
});
