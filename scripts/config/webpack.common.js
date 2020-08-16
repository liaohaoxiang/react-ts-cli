const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { isDev, PATH } = require('../constant')

module.exports = {
  entry: {
    app: path.resolve(PATH, './src/app.js'),
  },
  output: {
    filename: `js/[name]${isDev ? '' : '[hash:8]'}.js`,
    path: path.resolve(PATH, './dist'),
  },
  plugins: [
    // 配置html-webpack-plugin配置
    new HtmlWebpackPlugin({
      template: path.resolve(PATH, './public/index.html'),
      filename: 'index.html',
      cache: false, // 防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题
      minify: isDev
        ? false
        : {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true,
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          useShortDoctype: true,
        },
    }),
  ],
}
