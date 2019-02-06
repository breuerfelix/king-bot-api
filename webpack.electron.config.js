const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	// entry file - starting point for the app
	entry: [
		'@babel/polyfill',
		'./electron'
	],

	mode: 'production',

	resolve: {
		extensions: ['.js', '.jsx'],
		modules: ['node_modules', 'electron']
	},

	performance: {
		hints: false
	},

	// where to dump the output of a production build
	output: {
		path: path.join(__dirname, 'electron-dist'),
		filename: 'bundle.js',
		publicPath: '/'
	},

	module: {
		rules: [
			{
				test: /\.jsx?/i,
				loader: 'babel-loader',
				options: {
					presets: [
						'@babel/env'
					],
					plugins: [
						['@babel/plugin-proposal-decorators', { legacy: true }],
						['@babel/plugin-transform-react-jsx', { pragma: 'h' }],
						'@babel/plugin-proposal-class-properties',
						'@babel/plugin-proposal-object-rest-spread'
					]
				}
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'automate kingdoms',
			template: path.join(__dirname, 'electron/index.html')
		}),
		new webpack.HotModuleReplacementPlugin()
	],

	devServer: {
		// serve up any static files from src/
		contentBase: path.join(__dirname, 'electron'),
		hot: true,
		inline: true,
		progress: true,
		port: 9000,

		proxy: {
			'/api': 'http://localhost:3000'
		},

		// enable gzip compression:
		compress: true,

		// enable pushState() routing, as used by preact-router et al:
		historyApiFallback: true
	}
};
