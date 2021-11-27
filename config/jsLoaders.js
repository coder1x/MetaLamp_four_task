
const DP = require('./isDev');
// работа с js файлами 
module.exports = {
  jsLoaders: (ext = 'ts') => {
    let loaders = null;
    if (ext == 'js') {
      loaders = [
        //'cache-loader', 
        {
          loader: 'babel-loader',
        }];
    }
    else {
      loaders = [
        //'cache-loader',
        {
          loader: 'ts-loader',
          options: {
            configFile: "tsconfig.web.json"
          }
        }
      ];
    }

    if (DP.isDev) {
      loaders.push('eslint-loader'); // позволяет проводить анализ качества вашего кода, написанного на любом выбранном стандарте JavaScript
    }

    return loaders;
  }

};
