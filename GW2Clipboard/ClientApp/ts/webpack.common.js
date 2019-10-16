const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: './src/ReactApp.tsx',

	plugins: [
		new CopyPlugin([
            { from: 'node_modules/react/umd/react.production.min.js', to: '../ClientApp/lib/react/[name].[ext]', toType: 'template' },
            { from: 'node_modules/react-dom/umd/react-dom.production.min.js', to: '../ClientApp/lib/react/[name].[ext]', toType: 'template' },
            { from: 'node_modules/react-router-dom/umd/react-router-dom.min.js', to: '../ClientApp/lib/react/[name].[ext]', toType: 'template' },
		])
	],

	// Enable sourcemaps for debugging webpack's output.
	devtool: 'source-map',

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [ '.ts', '.tsx', '.js', '.json' ],
		plugins: [ new TsConfigPathsPlugin() ]
	},

	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{ test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
		]
	},

	// When importing a module whose path matches one of the following, just
	// assume a corresponding global variable exists and use that instead.
	// This is important because it allows us to avoid bundling all of our
	// dependencies, which allows browsers to cache those libraries between builds.
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		'react-router-dom': 'ReactRouterDOM'
	}
};
