const path = require("path");

module.exports = {
  mode: "development",
  entry: "./index.js",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              [
                // 'import', // babel-plugin-import
                path.resolve('./plugins/babel-plugin-import.js'),
                {
                  "libraryDirectory": "",
                  "libraryName": "lodash"
                }
              ],
            ]
          },
        },
      },
    ],
  }
};