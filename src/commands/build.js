import webpack from 'webpack'
import webpackConfig from '../../webpack.config.js'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import devServer from 'webpack-dev-server'
import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import glob from 'glob'
import YAML from 'yaml'

import { readStream } from '../helpers'

const asyncGlob = async function(path) {
  return new Promise((resolve, reject) => {
    glob(path, {}, function(err, files) {
      if (err) {
        reject(err)
      }
      resolve(files)
    })
  })
}

const log = console.log

export default async function build(config) {
  let { entry, contentBase, port } = config

  const spinner = ora('Building').start()

  const contents = []

  // Resolve contents
  let pages = await fs.readdir(`${process.cwd()}/content/pages`)

  pages = await Promise.all(
    pages.map(async page => {
      return {
        yaml: await readStream(`${process.cwd()}/content/pages/${page}`),
        name:
        // Creates page path
          page.split(['.yml'])[0] === 'index'
            ? 'index.html'
            : `${page.split(['.yml'])[0]}/index.html`
      }
    })
  )

  let entities = await asyncGlob(`${process.cwd()}/content/entities/**/*.yml`)

  entities = await Promise.all(
    entities.map(async entity => {
      const [path] = entity.split('/entities/')[1].split('.yml')
      return {
        yaml: await readStream(entity),
        name: `${path}/index.html`
      }
    })
  )

  Array.from([...entities, ...pages]).forEach(({ name, yaml }) => {
    const data = YAML.parse(yaml)
    contents.push(
      new HtmlWebpackPlugin({
        cache: false,
        template: `src/templates/${data.template}.ejs`,
        templateParameters: data,
        filename: name,
        hash: true,
        // alwaysWriteToDisk: true
      })
    )
  })

  // Resolve project paths
  entry = `${process.cwd()}${contentBase}/${entry}`
  contentBase = `${process.cwd()}${contentBase}`

  // Webpack config
  const conf = webpackConfig({ contentBase, entry, config, contents })

  // Creates compiler
  const compiler = webpack(conf, function(err, stats) {
    if (err || stats.hasErrors()) {
      log(chalk.red(`Error building your project`), err, stats)
    }
    spinner.stop()
    log(chalk.blue(`Project built on /dist`))
  })
}
