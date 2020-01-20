const path = require('path');
const WebpackBar = require("webpackbar");
const TerserJSPlugin = require("terser-webpack-plugin");

const rootPath = path.resolve(__dirname);

const name = 'qcloud-iotexplorer-appdev-sdk';

module.exports = ({ mode = 'development', target } = {}) => {
	const devMode = mode === 'development';

	return {
		name,

		mode: devMode ? 'development' : 'production',

		// 配置入口
		entry: {
			index: path.join(rootPath, './src/index.ts'),
		},

		// 配置输出
		output: {
			pathinfo: devMode,

			path: devMode ? path.join(rootPath, target === 'miniprogram' ? './demo/miniprogram' :  './dist/debug') : path.join(rootPath, './dist/release'),
			filename: 'qcloud-iotexplorer-appdev-sdk.js',
			libraryTarget: 'umd',
		},

		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /(node_modules|vendor)/,
					use: [
						{
							loader: 'ts-loader',
							options: {},
						}
					],
				},
			],
		},

		resolve: {
			extensions: [".js", ".ts"],
			alias: {},
		},

		externals: {},

		devtool: devMode ? "source-map" : false,

		performance: {
			hints: devMode ? false : "warning",
			maxAssetSize: 1 * 1024 * 1024, // warn for 1Mb excceed
		},

		optimization: {
			minimizer: [
				new TerserJSPlugin({
					sourceMap: true,
					cache: true,
					terserOptions: { output: { comments: false } },
				}),
			],
			splitChunks: {
				// Code Splitting 不自动生成 vendors（默认超过一定大小会拆分 vendor）
				chunks: () => false,
			},
		},

		// 配置插件
		plugins: [
			// 进度条
			new WebpackBar({
				name,
			}),
		].filter(Boolean),
	};
};