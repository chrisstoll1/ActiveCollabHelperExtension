const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
});