import webpack from 'webpack'
import webpackConfig from '../../webpack.config.js'
import devServer from 'webpack-dev-server'
import chalk from 'chalk'
import ora from 'ora'

const log = console.log

export default async function development(config) {
    let { entry, contentBase, port } = config

    const spinner = ora('Launching dev server').start()

    // Resolve project paths
    entry = `${process.cwd()}${contentBase}/${entry}`
    contentBase = `${process.cwd()}${contentBase}`

    // Generate webpack.config.js
    const conf = webpackConfig({ contentBase, entry })
    // Creates compiler
    const compiler = webpack(conf)

    // Server options
    const serverOptions = conf.devServer
    const server = new devServer(compiler, serverOptions)

    // Listen to server
    server.listen(port || 3000, '0.0.0.0', function () {
        spinner.stop()
        log(chalk.blue(`Listening on port ${port || 3000}`))
    })
}