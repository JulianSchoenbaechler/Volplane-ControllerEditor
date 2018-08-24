// eslint-disable-next-line
const webpack = require('webpack');
// const path = require('path');

module.exports = {
  configureWebpack: {
    /* resolve: {
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
    ], */
  },
  chainWebpack: (config) => {
    config.module
      .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .use('file-loader')
      .loader('url-loader')
      .tap((options = {}) => {
        options.limit = 4096;
        options.name = 'fonts/[name].[hash:8].[ext]';
        return options;
      });
  },
};
