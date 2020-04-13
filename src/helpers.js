import path from 'path'
import { createWriteStream, createReadStream } from 'fs'

function convertToSlug(Text) {
  return Text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
}

function readStream(location) {
  const file = path.resolve(location)
  return new Promise((resolve, reject) => {
    const stream = createReadStream(file)
    stream.on('data', function(data) {
      resolve(data.toString('utf8'))
    })
    stream.on('error', function(error) {
      reject(error)
    })
  })
}

function writeStream(location, content) {
  const file = path.resolve(location)
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(file)
    stream.on('open', function(data) {
      stream.write(content)
      resolve(true)
    })
    stream.on('error', function(error) {
      reject(error)
    })
  })
}
function deleteFolderRecursive(path) {
  const fileSystem = require('fs')
  if (fileSystem.existsSync(path)) {
    fileSystem.readdirSync(path).forEach(file => {
      var curPath = path + '/' + file
      if (fileSystem.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fileSystem.unlinkSync(curPath)
      }
    })
    fileSystem.rmdirSync(path)
  }
}

export { convertToSlug, writeStream, readStream, deleteFolderRecursive }
