const path = require("path");

module.exports = {
  entry: "./static/app.js",
  output: {
    path: path.resolve(__dirname, "static"),
    filename: "dist/main.js",
  },
  devServer: {
    port: 1234,
    contentBase: path.resolve(__dirname, "static"),
    publicPath: "/assets/",
  },
};
