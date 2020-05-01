import ejs from 'ejs'
import fs from 'fs-extra'
import glob from 'glob'
import YAML from 'yaml'
import { readStream } from './helpers'

export default async function(content, loaderContext, template) {
  const fileLocation = loaderContext.resourcePath
  if (fileLocation.includes('template')) {
    return ejs.render(template, data, {})
  }
  const data = YAML.parse(content)
  const html = await getHTML(data)
  // Read YAML files and pass data to templates
  // const result = ejs.render(content, {}, {})
  // const contents = await getFiles(`${process.cwd()}/content`)
  // console.log(contents)
  // const pages = await fs.readdir(`${process.cwd()}/content`)
  // getPageData()
  // console.log(loaderContext.resourcePath, data, html)
  return html
}

async function getHTML(data) {
  const file = await readStream(
    `${process.cwd()}/src/templates/${data.template}.ejs`
  )
  return ejs.render(file, data, {})
}

// async function getHTML(data) {
//   const file = await readStream(
//     `${process.cwd()}/src/templates/${data.template}.ejs`
//   )
//   return ejs.render(file, data, {})
// }

function renderContent() {}
