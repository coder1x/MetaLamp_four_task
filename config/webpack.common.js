const path = require('path');

const { merge } = require('webpack-merge');
const paths = require('./paths');
const FL = require('./filename');
const env = require('./isDev');
const optimization = require('./optimization');

const devServer = require('./webpack.devServer.js');

let config = null;

const plugin = ['@plugins/importPlugin.ts'];
const points = [];

if (env.isDev) {
  points.push('webpack/hot/dev-server');
}

points.push('./index.ts');

if (env.isPlugin) {
  config = {
    plugin,
  };
} else {
  config = {
    plugin,
    demo: points,
  };
}

module.exports = merge(devServer, {

  target: 'web',
  devtool: env.isDev ? 'source-map' : false, //  (карта для браузеров)

  entry: config,
  context: paths.src, // корень исходников
  mode: env.isDev ? 'development' : 'production',
  output: {
    filename: FL.filename('js'),
    path: paths.dist, // каталог в который будет выгружаться сборка.
    publicPath: 'auto',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
    alias: {
      '@plugins': path.join(paths.src, 'plugins'),
      '@styles': path.join(paths.src, 'shared', 'styles'),
      '@typescript': path.join(paths.src, paths.assets, 'ts'),
      '@img': path.join(paths.src, 'images'),
      '@pag': path.join(paths.src, 'pages'),
      '@com': path.join(paths.src, 'components'),
      '@shared': path.join(paths.src, 'shared'),
      '@': paths.src,
      comp: paths.components,
    },
  },

  optimization: optimization.optimization(),
});
