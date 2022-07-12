const TerserPlugin = require('terser-webpack-plugin');
const env = require('./isDev');

module.exports = {
  optimization: () => {
    const config = {
      runtimeChunk: env.isPlugin ? undefined : 'single',
      splitChunks: {
        chunks: 'all',
      },
    };

    if (!env.isDev) {
      config.minimizer = [
        new TerserPlugin({
          parallel: true,
        }),
      ];
    }
    return config;
  },
};
