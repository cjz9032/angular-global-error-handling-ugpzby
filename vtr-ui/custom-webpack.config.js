module.exports = {
	module: {
		rules: [
			{
				test: /\.html$/,
				use: 'html-loader',
			},
		],
	},
	externals: {
		canvg: 'canvg',
		html2canvas: 'html2canvas',
		dompurify: 'dompurify',
	},
};
