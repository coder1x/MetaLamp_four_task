

const key = process.env.NODE_ENV;
module.exports = {
  isDev: key === 'development',
  isProd: !this.isDev,
  isMulti: key === 'abspath',
  isPlugin: key === 'plugin',
};