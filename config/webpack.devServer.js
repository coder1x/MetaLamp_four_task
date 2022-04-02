const PATHS = require('./paths');
const path = require('path');

module.exports = {
  devServer: { // локальный сервер который будет запущен на http://localhost:8080/
    contentBase: path.join(PATHS.dist + '/'),
    compress: true,
    port: 8080,
    historyApiFallback: true,
    open: true,
  },
};

