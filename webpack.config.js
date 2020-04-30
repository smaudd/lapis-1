import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import LiveReloadPlugin from 'webpack-livereload-plugin'
import path from 'path'
import ejs from './src/ejs'
import fs from 'fs-extra'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin'

export default function(env) {
  const { contentBase, entry, config, contents, mode = 'development' } = env
  return {
    entry,
    mode,
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js)$/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(yml)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: function(name) {
                  if (name.includes('index')) {
                    return 'index.html'
                  }
                  if (name.includes('entities')) {
                    let [entity] = name.split('/entities/')[1].split('/')
                    return `${entity}/[name]/index.html`
                  }
                  return '[name]/index.html'
                }
              }
            },
            'extract-loader',
            {
              loader: 'html-loader',
              options: {
                attributes: false,
                esModule: true,
                preprocessor: async function(content, loaderContext) {
                  try {
                    return ejs(content, loaderContext, config)
                  } catch (err) {
                    throw new Error(err)
                  }
                }
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      ...contents,
      new HtmlWebpackHarddiskPlugin(),
      new MiniCssExtractPlugin({
        filename: '../styles/[name].css',
        chunkFilename: '[id].css'
      }),
      new CopyPlugin([
        {
          from: `${process.cwd()}/src/assets`,
          to: `${process.cwd()}/dist/assets`
        }
      ])
    ],
    resolve: {
      extensions: ['*', '.js', '.json', '.ejs']
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
    },
    output: {
      path: path.resolve(process.cwd(), 'dist/'),
      chunkFilename: '[name].js',
      publicPath: '/dist/',
      filename: 'main.js'
    },
    devServer: {
      compress: true,
      port: 3000,
      contentBase: ['/dist/', `${process.cwd()}/content`],
      progress: true,
      watchContentBase: true,
      publicPath: '/',
      overlay: true
      // stats: 'errors-only',
      // noInfo: true
      // watchOptions: {
      //   poll: true,
      //   ignored: /node_modules/
      // }
    }
    // stats: 'none'
  }
}
