module.exports = {
  module: {
    rules: [
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
                console.log(e)
                return e
              }
            }
          }
        ]
      }
    ]
  }
}
