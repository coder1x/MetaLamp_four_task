const key = process.env.NODE_ENV;
module.exports = {
  isDev: key === 'development',
  isPlugin: key === 'plugin',
};
