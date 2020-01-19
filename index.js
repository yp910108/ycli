const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync
const chalk = require('chalk')
const mkdirp = require('mkdirp')

class YCli {
  constructor() {
    this.checkUpdate()
    this.checkTpl()
    this.initCmd()
  }
  checkUpdate() {
    const { name, version } = require('./package.json')
    const ltsVersion = execSync(`npm view ${name} version`) + ''
    if (ltsVersion.trim() !== version) {
      console.log(chalk.yellow('正在升级 ycli'))
      execSync(`npm install ${name}@latest -g`)
      console.log(chalk.green('升级完成'))
    }
  }
  checkTpl() {
    const dirTpls = path.join(__dirname, '.templates')
    mkdirp(dirTpls)
    const pkgFile = path.join(dirTpls, 'package.json')
    if (!fs.existsSync(pkgFile)) {
      fs.writeFileSync(
        pkgFile,
        JSON.stringify({
          name: '_',
          description: '_',
          repository: '_',
          license: 'MIT'
        })
      )
    }
  }
  initCmd() {
    const cmds = fs
      .readdirSync(path.join(__dirname, 'scripts'))
      .map(item => item.split('.')[0])
    const cmd = process.argv[2]
    if (!cmds.includes(cmd)) {
      return console.log(chalk.red('无效命令'))
    }
    require(path.join(__dirname, 'scripts', cmd))()
  }
}

module.exports = new YCli()
