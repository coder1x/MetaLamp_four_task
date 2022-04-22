const path = require('path');
const env = require('./isDev');
const cssLoaders = require('./cssLoaders');
const jsLoaders = require('./jsLoaders');
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
        loader: 'pug-loader',
        options: {
          pretty: env.isDev,
        },
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
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: jsLoaders.jsLoaders('js'),
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: jsLoaders.jsLoaders(),
      },

      {
        test: /\.(png|jpg|svg|gif|webp|avif)$/,
        loader: 'file-loader',
        options: {
          outputPath: path.join('.', paths.assets, 'images/'),
          publicPath: '/assets/images/',
        },
      },

      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
    ],
  },
};
