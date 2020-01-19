const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const yoemanEnv = require('yeoman-environment').createEnv()
const { getInstalledPkgs, getInstalledStatus } = require('../utils')
const install = require('./install')

module.exports = async function() {
  const dirTpls = path.join(__dirname, '../.templates')
  const pkgs = getInstalledPkgs(dirTpls)
  if (!Object.keys(pkgs).length) {
    return console.log(
      chalk.yellow(`您还没有安装任何 generator，请先执行 install 命令安装`)
    )
  }
  const { tpl: pkgName } = await inquirer.prompt({
    message: '请选择一个模板',
    type: 'list',
    name: 'tpl',
    choices: Object.keys(pkgs)
  })
  const status = getInstalledStatus(pkgName, dirTpls)
  if (status !== 2) {
    const { needUpdate } = await inquirer.prompt({
      message: '有最新模板是否更新',
      type: 'list',
      name: 'needUpdate',
      choices: ['是', '否']
    })
    if (needUpdate === '是') {
      await install(pkgName)
    }
  }
  yoemanEnv.register(path.join(dirTpls, 'node_modules', pkgName), pkgName)
  yoemanEnv.run(pkgName)
}
