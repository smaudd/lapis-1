import webpack from 'webpack'
import webpackConfig from '../../webpack.config.js'
import devServer from 'webpack-dev-server'
import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import YAML from 'yaml'
import { readStream } from '../helpers'
import glob from 'glob'

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

export default async function development(config) {
  let { entry, contentBase, port } = config

  const spinner = ora('Launching dev server').start()

  const contents = []

  // Resolve contents
  let pages = await fs.readdir(`${process.cwd()}/content/pages`)

  pages = await Promise.all(
    pages.map(async page => {
      return {
        yaml: await readStream(`${process.cwd()}/content/pages/${page}`),
        name:
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

  Array.from([...entities, ...pages]).forEach(content => {
    const data = YAML.parse(content.yaml)
    console.log(content.name)
    contents.push(
      new HtmlWebpackPlugin({
        template: `src/templates/${data.template}.ejs`,
        templateParameters: data,
        filename: content.name,
        cache: false
      })
    )
  })

  // Resolve project paths
  entry = `${process.cwd()}${contentBase}/${entry}`
  contentBase = `${process.cwd()}${contentBase}`

  // Generate webpack.config.js
  const conf = webpackConfig({ contentBase, entry, contents })
  // Creates compiler
  const compiler = webpack(conf)

  // compiler.watch({
  //   poll: true,
  // }, function (err, stats) {
  //   console.log(err, stats)
  // })

  // Server options
  const serverOptions = conf.devServer
  const server = new devServer(compiler, serverOptions)

  // Listen to server
  server.listen(port || 3000, '0.0.0.0', function() {
    spinner.stop()
    log(chalk.blue(`Listening on port ${port || 3000}`))
  })
}
