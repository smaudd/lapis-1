import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import execa from 'execa'


const log = console.log

export default async function createProject(name) {
    if (!name) {
        log(chalk.blue(`Set a name for your project like 'lapis new myProject'`))
        return
    }
    const spinner = ora(`Creating new project ${name}`).start()
    await fs.ensureDir(`${process.cwd()}/${name}`)
    await fs.copy(`${__dirname}/../project_template`, `${process.cwd()}/${name}`)
    await execa(`git`, [`init`, `${name}`])
    spinner.stop()
    log(chalk.blue(`Project created`))
}