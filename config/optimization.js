const TerserPlugin = require("terser-webpack-plugin"); // минимизация js 

const DP = require('./isDev');
// в зависемости от сборки выбераем оптимизацию на выходе

module.exports = {
  optimization: () => {
    const config = {  // позволяет лишний код который используеться в нескольких js файлах вынести в один отдельный файл тем самым минимизируя основные.
      runtimeChunk: DP.isPlugin ? undefined : 'single',
      splitChunks: {  // создаються файлы vendors
        chunks: 'all' // создаёт отдельные вендор файлы в которые кидает весь лишний код, при этом наш бандел файл перестаёт весить полтора мегобайта :). 
      }
    };

    if (DP.isProd) {  // минимизируем код если собираем в продакшен
      config.minimizer = [
        new TerserPlugin({
          parallel: true,
        }),
      ];
    }

    return config;
  }

};
