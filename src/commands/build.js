import webpack from 'webpack'
import webpackConfig from '../../webpack.config.js'
import devServer from 'webpack-dev-server'
import chalk from 'chalk'
import ora from 'ora'

const log = console.log

export default async function build(config) {
    let { entry, contentBase, port } = config

    const spinner = ora('Starting build').start()

    // Resolve project paths
    entry = `${process.cwd()}${contentBase}/${entry}`
    contentBase = `${process.cwd()}${contentBase}`
    console.log(contentBase)
    // Generate webpack.config.js
    // const conf = webpackConfig({ contentBase, entry })

    // // Creates compiler
    // const compiler = webpack(conf, function (err, stats) {
    //     if (err || stats.hasErrors()) {
    //         console.log(err, stats)
    //     }
    //     spinner.stop()
    // })
}