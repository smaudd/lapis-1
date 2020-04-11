import development from './commands/development'
import { promises as fs } from 'fs'
import YAML from 'yaml'

export async function cli(args) {
    const cmd = args.slice(2)[0]
    let config = await fs.readFile(`${process.cwd()}/lapis.yml`, 'utf8')
    config = YAML.parse(config)
    switch (cmd) {
        case 'dev':
            development(config)
            break
    }

}