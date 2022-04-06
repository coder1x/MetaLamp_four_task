const { merge } = require('webpack-merge');
const commonConfig = require('./config/webpack.common');
const pluginsConfig = require('./config/webpack.plugins');
const moduleConfig = require('./config/webpack.module');

// eslint-disable-next-line no-unused-vars
module.exports = (env) => merge(commonConfig, pluginsConfig, moduleConfig);
