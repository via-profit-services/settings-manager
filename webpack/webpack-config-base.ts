import { knexExternals } from '@via-profit-services/knex/dist/webpack-utils';
import { Configuration, DefinePlugin } from 'webpack';

import { version } from '../package.json';

const webpackBaseConfig: Configuration = {
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.graphql$/,
        use: 'raw-loader',
      },
    ],
  },
  node: {
    __filename: true,
    __dirname: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.graphql'],
  },
  plugins: [
    new DefinePlugin({
      'process.env.MODULE_VERSION': JSON.stringify(version),
      'process.env.MODULE_VERSION_ID': JSON.stringify('86c8a79c-f356-4c63-a4ee-b0fa579dedf7'),
    }),
  ],
  externals: [
    ...knexExternals,
    /^@via-profit-services\/core/,
    /^@via-profit-services\/knex/,
    /^@via-profit-services\/accounts/,
    /^moment$/,
    /^moment-timezone$/,
    /^uuid$/,
    /^dataloader$/,
    /^winston$/,
    /^graphql$/,
    /^winston-daily-rotate-file$/,
  ],
}

export default webpackBaseConfig;
