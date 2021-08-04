const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
//const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  output: {
    filename: 'static/js/[name].[hash].js',
  },
  module: {
    rules: [
	  {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
	//new UglifyJsPlugin(),
	 // 删掉webpack提供的UglifyJS插件
    //new UglifyJsPlugin({
    //  uglifyOptions: {
    //    compress: {
    //      warnings: false
    //    }
    //  },
    //  sourceMap: config.build.productionSourceMap,
    //  parallel: true
    //}),
    // 增加 webpack-parallel-uglify-plugin来替换
	/*
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS:{
        output: {
          comments: false
        },
        compress: {
          warnings: false,
          drop_debugger: true, // 去除生产环境的 debugger 和 console.log
          drop_console: true
        }
      }
    }),
	*/
//	new ESLintPlugin(),
	
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[hash].css',
    }),
  ],
  optimization: {
	 concatenateModules: false
  }
});
	//new BundleAnalyzerPlugin(),