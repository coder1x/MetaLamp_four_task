const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const paths = require('./paths');

module.exports = {
  cssLoaders: (extra) => {
    const loaders = [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: false,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              [
                'autoprefixer',
                {
                  // Options
                },
                'css-mqpacker',
                {
                  // Options
                },
                'cssnano',
                {
                  preset: [
                    'default', {
                      discardComments: {
                        removeAll: true,
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      },
    ];

    if (extra) {
      loaders.push(extra);
      loaders.push({
        loader: 'sass-resources-loader',
        options: {
          resources: path.join(paths.src, 'assets/styles/glob.scss'),
        },
      });
    }

    return loaders;
  },
};
