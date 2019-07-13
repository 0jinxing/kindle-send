const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: path.resolve("client", "index.js"),
  output: {
    filename: "[name].[hash:4].js",
    path: path.resolve("dist")
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        ]
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
    new HtmlWebpackPlugin({ template: path.resolve("public", "index.html") })
  ]
};
