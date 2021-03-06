var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// refer https://github.com/owais/django-webpack-loader
// https://github.com/owais/webpack-bundle-tracker
// https://getbootstrap.com/docs/4.0/getting-started/webpack/

const output = {
  path: path.resolve(__dirname+'/static/bundles'),
  filename: `[name]${devMode ? '' : '-[hash]'}.js`,
  chunkFilename: `[name]${devMode ? '' : '-[hash]'}.js`,
  publicPath: '/static/bundles/',
}

module.exports = {
  context: __dirname,
  mode: devMode ? 'development' : 'production',
  entry: {
    main_css: './static/js/css',
    libs: './static/js/main',
    task_list: './taskmanagement/static/js/task_list'
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        lazy_libraries: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'async',
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        }
      }
    }
  },
  output,
  plugins: [
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static'
    // }),
    new BundleTracker({
      filename: './webpack-stats.json'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader, // inject CSS to page
        }, {
          loader: 'css-loader', // translates CSS into CommonJS modules
        }, {
          loader: 'postcss-loader', // Run post css actions
          options: {
            plugins: function () { // post css plugins, can be exported to postcss.config.js
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          }
        }, {
          loader: 'sass-loader' // compiles SASS to CSS
        }]
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]"
          }
        },
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.scss', '.vue', '.jsx'],
    alias: {
      static: path.resolve(__dirname, 'static')
    }
  }
};
