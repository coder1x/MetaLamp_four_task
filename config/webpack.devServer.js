const path = require('path');
const paths = require('./paths');

module.exports = {
  devServer: { // локальный сервер который будет запущен на http://localhost:8080/
    contentBase: path.join(`${paths.dist}/`),
    compress: true,
    port: 8080,
    historyApiFallback: true,
    open: true,
  },
};
