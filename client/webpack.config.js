const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const PRODUCTION = process.env.NODE_ENV === "production";

module.exports = {
  entry: path.resolve("client", "polyfills.ts"),
  output: {
    filename: "[name].[hash:4].js",
    path: path.resolve("dist")
  },
  mode: PRODUCTION ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              configFile: path.resolve("client", "babel.config.js")
            }
          }
        ]
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
    }
  },
  resolve: {
    extensions: [".js", ".jsx", "ts", ".tsx"]
  }
};
