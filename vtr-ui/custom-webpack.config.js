module.exports = {
	module: {
		rules: [
			{
				test: /\.html$/,
				use: 'html-loader'
			},
			// workaround for warning: System.import() is deprecated and will be removed soon. Use import() instead.
			// {
			//     test: /[\/\\]@angular[\/\\].+\.js$/,
			//     parser: { system: true }
			// }
		]
	},
	// plugins: [
	//     new HtmlWebpackPlugin({ template: './src/index.html' }),
	//     new webpack.DefinePlugin({
	//         // global app config object
	//         config: JSON.stringify({
	//             apiUrl: 'http://localhost:4000'
	//         })
	//     }),

	//     // workaround for warning: Critical dependency: the request of a dependency is an expression
	//     new webpack.ContextReplacementPlugin(
	//         /\@angular(\\|\/)core(\\|\/)fesm5/,
	//         path.resolve(__dirname, 'src')
	//     )
	// ],
	// optimization: {
	//     splitChunks: {
	//         chunks: 'all',
	//     },
	//     runtimeChunk: true
	// },
	// devServer: {
	//     historyApiFallback: true
	// }
}
