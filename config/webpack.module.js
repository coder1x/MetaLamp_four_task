const path = require('path');
const cssLoaders = require('./cssLoaders');
const paths = require('./paths');

module.exports = {

  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders.cssLoaders(),
      },
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders.cssLoaders('sass-loader'),
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        loader: 'file-loader',
        options: {
          outputPath: path.join('.', paths.assets, 'fonts/'),
          publicPath: '/assets/fonts/',
        },
      },
      {
        test: /\.(ts|tsx|js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.web.json',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|svg|gif|webp|avif)$/,
        loader: 'file-loader',
        options: {
          outputPath: path.join('.', paths.assets, 'images/'),
          publicPath: '/assets/images/',
        },
      },
    ],
  },
};
