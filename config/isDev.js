

const key = process.env.NODE_ENV;
module.exports = {
  isDev: key === 'development' || key !== 'multisite',
  isProd: !this.isDev,
  isMulti: key === 'multisite',
};