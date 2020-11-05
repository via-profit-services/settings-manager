/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { ProgressPlugin, BannerPlugin } = require('webpack');
const merge = require('webpack-merge');
const packageInfo = require('../package.json');
const baseConfig = require('./webpack.config.base');

const ViaProfitPlugin = require('@via-profit-services/core/dist/webpack');

module.exports = merge(baseConfig, {
  entry: {
    index: path.resolve(__dirname, '../src/index.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  mode: 'production',
  plugins: [
    new ViaProfitPlugin(),
    new ProgressPlugin(),
    new BannerPlugin({
      banner: `
Via Profit Services / Settings Manager

Repository ${packageInfo.repository.url}
Contact    ${packageInfo.support}
      `,
    }),
    new FileManagerPlugin({
      onStart: {
        delete: ['./dist'],
      },
      onEnd: {
        copy: [
          {
            source: './src/database/migrations/*',
            destination: './dist/database/migrations/',
          },
          {
            source: './src/database/seeds/*',
            destination: './dist/database/seeds/',
          },
        ],
        delete: [
          './dist/playground',
          './dist/database/migrations/!(+([0-9])_settings-manager-*@(.ts|.d.ts))',
        ],
      },
    }),
  ],

  externals: {
    '@via-profit-services/core': {
      commonjs2: '@via-profit-services/core',
    },
    moment: {
      commonjs2: 'moment',
    },
    'moment-timezone': {
      commonjs2: 'moment-timezone',
    },
    uuid: {
      commonjs2: 'uuid',
    },
  },
});
