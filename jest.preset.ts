// eslint-disable-next-line camelcase
const ts_preset = require('ts-jest/jest-preset');
// eslint-disable-next-line camelcase
const puppeteer_preset = require('jest-puppeteer/jest-preset');


module.exports = Object.assign(
  ts_preset,
  puppeteer_preset
);