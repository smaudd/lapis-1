import development from './commands/development'
import createProject from './commands/create_project'
import build from './commands/build'
import { promises as fs } from 'fs'
import YAML from 'yaml'

export async function cli(args) {
  const cmd = args.slice(2)[0]
  const options = args.slice(2)[1]
  let config = await fs.readFile(`${process.cwd()}/lapis.yml`, 'utf8')
  config = YAML.parse(config)
  switch (cmd) {
    case 'new':
      createProject(options)
      break
    case 'dev':
      development(config)
      break
    case 'build':
      build(config)
      break
  }
}
