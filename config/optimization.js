const TerserPlugin = require('terser-webpack-plugin');
const DP = require('./isDev');

module.exports = {
  optimization: () => {
    const config = {
      runtimeChunk: DP.isPlugin ? undefined : 'single',
      splitChunks: {
        chunks: 'all',
      },
    };

    if (DP.isProd) {
      config.minimizer = [
        new TerserPlugin({
          parallel: true,
        }),
      ];
    }
    return config;
  },
};
