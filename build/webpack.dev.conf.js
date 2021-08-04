const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 9000,
    open: true,
    clientLogLevel: 'warn',
    compress: true,
    overlay: true,
    stats: 'errors-only',
    hot: true,
  },
  module: {
    rules: [
	  {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
	
  },
  plugins: [
		new ESLintPlugin()
	]
});