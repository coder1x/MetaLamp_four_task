const { merge } = require('webpack-merge');
const commonConfig = require('./config/webpack.common');
const pluginsConfig = require('./config/webpack.plugins');
const moduleConfig = require('./config/webpack.module');

module.exports = () => merge(commonConfig, pluginsConfig, moduleConfig);
