const path = require('path');
const env = require('./isDev');
const paths = require('./paths');

module.exports = {
  filename(ext) {
    let dir = '';

    if (ext === 'css') {
      dir = path.join('.', paths.assets, 'css/');
    } else if (ext === 'js') {
      dir = path.join('.', paths.assets, 'js/');
    }

    if (env.isDev || env.isPlugin) {
      return `${dir}[name].${ext}`;
    }
    return `${dir}[name].[hash].${ext}`;
  },
};
