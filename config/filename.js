const path = require('path');
const DP = require('./isDev');
const PATHS = require('./paths');

module.exports = {
  filename(ext) {
    let dir = '';

    if (ext === 'css') {
      dir = path.join(PATHS.assets, 'css/');
    } else if (ext === 'js') {
      dir = path.join(PATHS.assets, 'js/');
    }

    if (DP.isDev || DP.isPlugin) {
      return `${dir}[name].${ext}`;
    }
    return `${dir}[name].[hash].${ext}`;
  },
};
