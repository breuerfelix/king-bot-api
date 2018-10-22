const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	// entry file - starting point for the app
	entry: './frontend',
	mode: 'development',

	resolve: {
		extensions: [ '.js', '.jsx' ],
		modules: [ 'node_modules', 'frontend' ]
	},

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
						[ '@babel/plugin-transform-react-jsx', { pragma: 'h' } ],
						'@babel/plugin-proposal-class-properties'
					]
				}
			},
			{
				test: /\.(css|sass|scss)$/,
				loader: [ 'style-loader', 'css-loader', 'sass-loader' ]
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'automate kingdoms',
			template: path.join(__dirname, 'frontend/index.html')
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
