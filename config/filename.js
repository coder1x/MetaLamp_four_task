const DP = require('./isDev');
const PATHS = require('./paths');
const path = require('path');

module.exports = {
  filename: function (ext) {
    let dir = '';

    if (ext === 'css') {
      dir = path.join(PATHS.assets, 'css/');
    } else
      if (ext === 'js') {
        dir = path.join(PATHS.assets, 'js/');
      }

    if (DP.isDev || DP.isPlugin) {
      return `${dir}[name].${ext}`;
    }
    else {
      return `${dir}[name].[hash].${ext}`;
    }
  }
};
