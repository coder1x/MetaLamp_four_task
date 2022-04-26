const paths = require('./paths');

module.exports = {
  devServer: { // локальный сервер который будет запущен на http://localhost:8080/
    watchFiles: [
      `${paths.src}/components/**/*.pug`,
      `${paths.src}/pages/**/*.pug`,
      `${paths.src}/components/**/*.json`,
      `${paths.src}/pages/**/*.json`,
    ],
    compress: true,
    port: 8080,
    historyApiFallback: true,
    open: true,
  },
};
