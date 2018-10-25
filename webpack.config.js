const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	// entry file - starting point for the app
	entry: [
		'@babel/polyfill',
		'./frontend'
	] ,

	mode: 'development',

	resolve: {
		extensions: [ '.js', '.jsx' ],
		modules: [ 'node_modules', 'frontend' ]
	},

	performance: {
		hints: false
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
			},
			{
				test:/.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader: [ 'file-loader' ]
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

	devServer: {
		// serve up any static files from src/
		contentBase: path.join(__dirname, 'frontend'),
		hot: true,
		inline: true,
		progress: true,

		proxy: {
			'/api': 'http://localhost:3000'
		},

		// enable gzip compression:
		compress: true,

		// enable pushState() routing, as used by preact-router et al:
		historyApiFallback: true
	}
};
