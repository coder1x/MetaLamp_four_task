

const PATHS = require('./paths');

// .replace(/\/\//g, "/")

module.exports = {
  devServer: { // локальный сервер который будет запущен на http://localhost:8080/
    contentBase: PATHS.dist.replace(/\/\//g, "/") + '\\',
    compress: true,
    port: 8080,
    historyApiFallback: true,
    open: true,
    //hot: true, // включает горячую замену модуля без обнавления страницы. 
    //watchContentBase: true,
  },

};

