const cssLoaders = require('./cssLoaders');

module.exports = {

  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders.cssLoaders(),
      },
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders.cssLoaders('sass-loader'),
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]',
        },
      },
      {
        test: /\.(ts|tsx|js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.web.json',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|svg|gif|webp|avif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]',
        },
      },
    ],
  },
};
