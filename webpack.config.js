const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/main.ts",
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist/"),
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  devtool: process.env.NODE_ENV === "production" ? false : "eval-source-map",
  optimization: {
    minimize: process.env.NODE_ENV === "production",
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
};
