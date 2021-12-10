

const DP = require('./isDev');
const CL = require('./cssLoaders');
const JL = require('./jsLoaders');
const PATHS = require('./paths');


module.exports = {

  module: {
    rules: [  // описание правил как вебПаку работать с тем или иным расширением файлов.
      {
        test: /\.css$/,
        use: CL.cssLoaders(),
      },

      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: DP.isDev  // минифицировать или нет в зависемости от типа зборки. 
        }
      },

      { // работа с препроцессором SCSS
        test: /\.s[ac]ss$/,
        use: CL.cssLoaders('sass-loader') // преобразовать scss в css
      },

      { // работа с файлами шрифтов
        test: /\.(ttf|woff|woff2|eot)$/,
        loader: 'file-loader',
        options: {
          outputPath: PATHS.assets + 'fonts\\',
          publicPath: DP.isMulti ?
            PATHS.public + '/assets/fonts/' : '/assets/fonts/',
        },
      },

      { // работа с js файлами
        test: /\.(js)$/,
        exclude: /node_modules/,  // игнорируем эту папку. что бы не обрабатывать файлы от туда. 
        use: JL.jsLoaders('js')
      },
      { // работа с ts файлами
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,  // игнорируем эту папку. что бы не обрабатывать файлы от туда. 
        use: JL.jsLoaders(),
      },

      { // работа с графическими файлами
        test: /\.(png|jpg|svg|gif|webp|avif)$/,
        loader: 'file-loader',
        options: {
          outputPath: PATHS.assets + 'images/',
          publicPath: DP.isMulti ?
            PATHS.public + '/assets/images/' : '/assets/images/',
        },
      },

      { // работа с xml структурой
        test: /\.xml$/,
        use: ['xml-loader']
      },
      { // работа с выгрузкой базы данных
        test: /\.csv$/,
        use: ['csv-loader']
      },

    ],
  },

};