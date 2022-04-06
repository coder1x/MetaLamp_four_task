const path = require('path');
const PATHS = require('./paths');

module.exports = {
  devServer: { // локальный сервер который будет запущен на http://localhost:8080/
    contentBase: path.join(`${PATHS.dist}/`),
    compress: true,
    port: 8080,
    historyApiFallback: true,
    open: true,
  },
};
