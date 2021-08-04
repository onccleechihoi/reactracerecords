const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashWebpackPlugin = require('lodash-webpack-plugin');
//new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' } ])

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].js',
	chunkFilename: '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.jsx','.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@img': path.resolve(__dirname, '../src/assets/img'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
		exclude: /node_modules/,
        use: {
          loader: "babel-loader",
		  options: { 
			  plugins: ['lodash'], 
			  presets: ['@babel/preset-react']
		  }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              name: 'static/img/[name].[ext]',
            },
          },
        ],
      },
	  {
		  test: /\.(mov|mp4)$/,
		  use: [
			{
			  loader: 'file-loader',
			  options: {
				name: '[name].[ext]'
			  }  
			}
			]
		}
    ],
  },
  plugins: [
	/*
	new HappyPack({
            id: 'babel',
            loaders: ['babel-loader?cacheDirectory']
        }),
    new VueLoaderPlugin(),
	*/
	
    new CleanWebpackPlugin(),
	//https://magiclen.org/webpack-lodash/
	//new LodashWebpackPlugin(),
	new LodashWebpackPlugin({ 'collections': true, caching: true, exotics: true  }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      favicon: './public/favicon.ico',
    }),
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
	usedExports: true,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendors',
          enforce: true,
        },
        default: false,
      },
    },
  },
};