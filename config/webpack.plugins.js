const HTMLWebpackPlugin = require('html-webpack-plugin'); // упрощает создаение HTML файлов, добавления хеша в имена файлов
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // удаляет все ненужные файлы при перестройке проекта
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Он создает файл CSS для каждого файла JS, который содержит CSS
const fs = require('fs');

const FoxFavicon = require('fox-favicon');
const FoxUrlConvertor = require('fox-url-convertor');

const DP = require('./isDev');
const FL = require('./filename');
const PATHS = require('./paths');
const PAGES_DIR = `${PATHS.src}\\pages\\`; // каталог где располагаються PUG  файлы


const pages = [];
fs.readdirSync(PAGES_DIR).forEach((file) => {
  pages.push(file.split('/', 2));
});

const description = 'Лучшие номера для вашей работы,' +
  ' отдыха и просто вдохновения';
const keywords = 'Номера, Отель';
const title = 'booking rooms for TOXIN';

module.exports = {

  plugins: [
    new CleanWebpackPlugin(),   // очищаем от лишних файлов в папке дист


    ...pages.map(fileName => new HTMLWebpackPlugin({
      getData: () => {
        try {
          return JSON.parse(fs.readFileSync(
            `./pages/${fileName}/data.json`, 'utf8'
          ));
        } catch (e) {
          console.warn(
            `data.json was not provided for page ${fileName}`
          );
          return {};
        }
      },
      title: title,
      filename: `${fileName}.html`,
      template: `./pages/${fileName}/${fileName}.pug`,
      alwaysWriteToDisk: true,
      inject: 'body',
      hash: true,
      meta: {
        'viewport': {
          'name': 'viewport',
          'content':
            'width=device-width, initial-scale=1',

        },
        'Content-Type': {
          'http-equiv': 'Content-Type',
          'content': 'text/html; charset=utf-8'
        },
        'compatible': {
          'http-equiv': 'x-ua-compatible',
          'content': 'ie=edge'
        },
        'description': {
          'name': 'description',
          'content': description
        },
        'keywords': {
          'name': 'keywords',
          'content': keywords
        },
        'twitter-card': {
          'name': 'twitter:card',
          'content': 'summary_large_image'
        },
        'twitter-title': {
          'name': 'twitter:title',
          'content': 'booking rooms for TOXIN'
        },
        'twitter-description': {
          'name': 'twitter:description',
          'content': 'Лучшие номера для вашей работы,' +
            ' отдыха и просто вдохновения'
        },
        'twitter-site': {
          'name': 'twitter:site',
          'content': 'https://thylacine.ru/'
        },
        'twitter-image': {
          'name': 'twitter:image',
          'content': 'https://thylacine.ru/social.webp'
        },
        'og-type': {
          'property': 'og:type',
          'content': 'website'
        },
        'og-title': {
          'property': 'og:title',
          'content': 'booking rooms for TOXIN'
        },
        'og-description': {
          'property': 'og:description',
          'content': 'Лучшие номера для вашей работы,' +
            ' отдыха и просто вдохновения'
        },
        'og-image': {
          'property': 'og:image',
          'content': 'https://thylacine.ru/social.webp'
        }
      },
    })),


    new FoxUrlConvertor({
      URLchange: '%5C',
      URLto: '/',
    }),


    new FoxFavicon({
      src: `${PATHS.src}${PATHS.assets}images/icon/favicon.png`,
      path: 'assets/favicons/',
      //pathManifest: '/assets/favicons/',
      urlIcon: 'https://thylacine.ru/assets/favicons/',
      devMode: DP.isDev,
      appName: 'бронирование номеров в TOXIN отель.',
      appShortName: 'TOXIN',
      appDescription: 'Лучшие номера для вашей работы,' +
        ' отдыха и просто вдохновения',
      developerName: 'coder1',
      developerURL: 'https://github.com/coder1x/',
      icons: {
        'android': [
          'android-chrome-36x36.png',
          'android-chrome-48x48.png',
          'android-chrome-72x72.png',
          'android-chrome-96x96.png',
          'android-chrome-144x144.png',
          'android-chrome-192x192.png',
          'android-chrome-256x256.png'
        ],
        'appleIcon': [
          'apple-touch-icon-114x114.png',
          'apple-touch-icon-120x120.png',
          'apple-touch-icon-167x167.png',
          'apple-touch-icon-57x57.png',
          'apple-touch-icon-60x60.png',
          'apple-touch-icon-72x72.png',
          'apple-touch-icon-76x76.png',
          'apple-touch-icon-precomposed.png',
          'apple-touch-icon.png'
        ],
        'appleStartup': [
          'apple-touch-startup-image-640x1136.png'
        ],
        'coast': true,                // Create Opera Coast icon. `boolean`
        'favicons': true,             // Create regular favicons. `boolean`
        'firefox': [
          'firefox_app_60x60.png',
          'firefox_app_128x128.png',
        ],
        'opengraph': true,            // Create Facebook OpenGraph image. `boolean`
        'twitter': true,              // Create Twitter Summary Card image. `boolean`
        'windows': true,              // Create Windows 8 tile icons. `boolean`
        'yandex': true                // Create Yandex browser icon. `boolean`
      }
    }),



    new MiniCssExtractPlugin({
      filename: FL.filename('css')
    }),

    new webpack.ProvidePlugin({  // подключаем jquery плагином, самый нормальный способ ..
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

    new webpack.HotModuleReplacementPlugin({ multiStep: true }),
  ],

};