const path = require("path");
const upload = require("express-fileupload");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const PRODUCTION = process.env.NODE_ENV === "production";
const config = require(`./config/${
  PRODUCTION ? "production.json" : "development.json"
}`);

module.exports = {
  entry: path.resolve("client", "index.js"),
  output: {
    filename: "[name].[hash:4].js",
    path: path.resolve("dist")
  },
  mode: PRODUCTION ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: ["url-loader"]
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.resolve("public"),
        to: path.resolve("dist"),
        ignore: path.resolve("public", "index.html")
      }
    ]),
    new HtmlWebpackPlugin({ template: path.resolve("public", "index.html") }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  optimization: {
    minimize: true
  },
  devServer: {
    port: 8000,
    contentBase: path.resolve("dist"),
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true
      }
    },
    before: app => {
      const limit = config.upload.limit;
      app.use(upload({ limits: { fileSize: limit } }));
    }
  }
};