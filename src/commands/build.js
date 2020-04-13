import webpack from 'webpack'
import webpackConfig from '../../webpack.config.js'
import devServer from 'webpack-dev-server'
import chalk from 'chalk'
import ora from 'ora'

const log = console.log

export default async function build(config) {
  let { entry, contentBase, port } = config

  const spinner = ora('Building').start()

  // Resolve project paths
  entry = `${process.cwd()}${contentBase}/${entry}`
  contentBase = `${process.cwd()}${contentBase}`

  // Webpack config
  const conf = webpackConfig({ contentBase, entry, config })

  // Creates compiler
  const compiler = webpack(conf, function(err, stats) {
    if (err || stats.hasErrors()) {
      log(chalk.red(`Error building your project`), err, stats)
    }
    spinner.stop()
    log(chalk.blue(`Project built on /dist`))
  })
}
