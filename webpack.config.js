
const commonConfig = require('./config/webpack.common');
const pluginsConfig = require('./config/webpack.plugins');
const moduleConfig = require('./config/webpack.module');

const { merge } = require('webpack-merge');


// eslint-disable-next-line no-unused-vars
module.exports = env => {

	return merge(commonConfig, pluginsConfig, moduleConfig);
};