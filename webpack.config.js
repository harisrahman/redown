const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const mode = process.env.NODE_ENV === 'production' ? "production" : "development";
const devMode = mode === "development";
const isHot = process.env.npm_lifecycle_event === "hot";

module.exports = {
	mode: mode,
	entry: './src/ts/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/redown.js',
		publicPath: '',
		library: {
			type: "umd"
		}
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	devtool: devMode ? "eval-source-map" : "source-map",
	optimization: {
		minimize: !devMode,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: true,
					keep_fnames: false,
					keep_classnames: false
				},
			}),
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "src/template.html",
			filename: "index.html",
			minify: !devMode
		}),
		new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ["**/*", "!.gitkeep"]
		})
	],
	module:
	{
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',
				options: {
					minimize: !devMode,
					esModule: false
				},
			},
			{
				test: /\.(png|svg|jpe?g|gif|ico)$/i,
				use: {
					loader: "file-loader",
					options: {
						name: '[name].[ext]',
						outputPath: 'files'
					}
				}
			},
			{
				test: /\.ts$/i,
				use: 'ts-loader',
				include: [path.resolve(__dirname, 'src/ts/')]
			},
		]
	},
	devServer: {
		port: 3000,
		hot: true,
		contentBase: path.join(__dirname, 'dist'),
		before(app, server)
		{
			server._watch('src/*.html');
		}
	}
};
