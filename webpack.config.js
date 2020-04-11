import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'

export default function (env) {
  const { contentBase, entry } = env
  return {
    entry,
    mode: 'development',
    devtool: 'inline-source-map',
    node: {
      __filename: false,
      __dirname: false
    },
    target: 'node',
    module: {
      rules: [
        {
          test: /\.(js)$/,
          use: {
            loader: 'babel-loader'
          },
          exclude: /node_modules/,
          include: /node_modules\/(?!babel-loader)/
        },
        {
          test: /\.html$/i,
          use: [
            'file-loader?name=[name].[ext]',
            'extract-loader',
            {
              loader: 'html-loader',
              options: {
                attributes: false,
                esModule: true,
                preprocessor: e => {
                  // console.log(e)
                  return e
                }
              }
            }
          ],
        },
        // {
        //   test: /\.css$/,
        //   use: [MiniCssExtractPlugin.loader, 'css-loader']
        // }
      ]
    },
    plugins: [
      // new MiniCssExtractPlugin({
      //   filename: '../styles/[name].css',
      //   chunkFilename: '[id].css'
      // }),
    ],
    resolve: {
      extensions: ['*', '.js', '.json'],
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    },
    output: {
      path: path.resolve(process.cwd(), 'dist'),
      chunkFilename: '[name].js',
      publicPath: '/dist',
      filename: 'main.js'
    },
    devServer: {
      compress: true,
      contentBase,
      watchContentBase: true,
      port: 3000,
      stats: 'errors-only',
      noInfo: true,
    },
    stats: 'none'
  }
}