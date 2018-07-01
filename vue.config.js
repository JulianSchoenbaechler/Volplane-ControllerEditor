// eslint-disable-next-line
const webpack = require('webpack');
const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        jquery: path.resolve(__dirname, './node_modules/jquery/src/jquery'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
    ],
  },
};
