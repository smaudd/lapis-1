import HtmlWebpackPlugin from 'html-webpack-plugin'
import fs from 'fs-extra'

class Lapis {
    apply(compiler) {
      compiler.hooks.watchRun.tapAsync('WatchRun', (compilation, callback) => {

          const changedTimes = compilation.watchFileSystem.watcher.mtimes;
          const changedFiles = Object.keys(changedTimes)
            .map(file => `\n  ${file}`)
            .join('');
          if (changedFiles.length) {
            console.log("====================================")
            console.log('NEW BUILD FILES CHANGED:', changedFiles);
            console.log("====================================")
          }
        callback()
      });
    }
  }
  

// class Lapis {
//   constructor() {

//   }
//   apply (compiler) {
//     // Resolve contents
//     // let pages = await fs.readdir(`${process.cwd()}/content/pages`)
//     this.plugin("watch-run", function(watching, callback) {
//         // maybe something in `watching` will indicate the changed file?
//         // when I find out what it is, `console.log` it here
//         console.log(watching)
//         callback()
//     })
//     // compiler.hooks.watchRun.tapAsync('Lapis', (compilation) => {
//     //   console.log('The compiler is starting a new compilation...')

//     // })
//   }
// }

// let { entry, contentBase, port } = config

// const spinner = ora('Launching dev server').start()

// const contents = []


// pages = await Promise.all(
//   pages.map(async page => {
//     return {
//       yaml: await readStream(`${process.cwd()}/content/pages/${page}`),
//       name:
//       // Creates page path
//         page.split(['.yml'])[0] === 'index'
//           ? 'index.html'
//           : `${page.split(['.yml'])[0]}/index.html`
//     }
//   })
// )

// let entities = await asyncGlob(`${process.cwd()}/content/entities/**/*.yml`)

// entities = await Promise.all(
//   entities.map(async entity => {
//     const [path] = entity.split('/entities/')[1].split('.yml')
//     return {
//       yaml: await readStream(entity),
//       name: `${path}/index.html`
//     }
//   })
// )

// Array.from([...entities, ...pages]).forEach(content => {
//   const data = YAML.parse(content.yaml)
//   // contents.push(
//   //   new HtmlWebpackPlugin({
//   //     cache: false,
//   //     template: `src/templates/${data.template}.ejs`,
//   //     templateParameters: (() => {
//   //       console.log('ME LLAMA EL CULEIRO')
//   //       return data
//   //     })(),
//   //     filename: content.name,
//   //     hash: true,
//   //     // alwaysWriteToDisk: true
//   //   })
//   // )
// })

export default Lapis