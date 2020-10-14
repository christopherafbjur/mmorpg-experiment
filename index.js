const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname, "/static")));

server.listen(PORT, () => {
  console.log("Server started at port:", PORT);
});
