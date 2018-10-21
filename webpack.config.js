const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	// entry file - starting point for the app
	entry: './frontend/index.jsx',
	mode: 'development',

	// where to dump the output of a production build
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js'
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
						['@babel/plugin-transform-react-jsx', { pragma: 'h' }]
					]
				}
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'automate kingdoms'
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	
	// enable Source Maps
	devtool: 'inline-source-map',

	devServer: {
		// serve up any static files from src/
		contentBase: path.join(__dirname, 'frontend'),
		hot: true,
		inline: true,
		progress: true,

		// enable gzip compression:
		compress: true,

		// enable pushState() routing, as used by preact-router et al:
		historyApiFallback: true
	}
};
