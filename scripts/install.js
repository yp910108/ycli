const path = require('path')
const execSync = require('child_process').execSync
const chalk = require('chalk')
const { getInstalledStatus } = require('../utils')

module.exports = function(pkgName) {
  pkgName = pkgName || process.argv[3]
  const dirTpls = path.join(__dirname, '../.templates')
  const status = getInstalledStatus(pkgName, dirTpls)
  if (status === 2) {
    return console.log(chalk.yellow('您已经安装最新版，无需安装'))
  }
  console.log(chalk.yellow(`正在安装最新版的 ${pkgName} ...`))
  try {
    execSync(`npm i ${pkgName}@latest -S`, { cwd: dirTpls })
    console.log(chalk.green('升级完成'))
  } catch (e) {
    console.log(chalk.red(`安装失败，请检查包名称是否正确 ${pkgName}`))
  }
}
