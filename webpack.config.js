import path from "path";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  mode: "production",
  plugins: [new NodePolyfillPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["node_modules"],
    fallback: {
      child_process: false,
      cluster: false,
      fs: false,
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
