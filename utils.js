const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

function getInstalledPkgs(targetDir) {
  const pkgJsonFile = path.join(targetDir, 'package.json')
  if (!fs.existsSync(pkgJsonFile)) return {}
  const pkgJson = require(pkgJsonFile)
  return pkgJson.dependencies || {}
}

function getInstalledStatus(pkgName, targetDir) {
  const genObj = getInstalledPkgs(targetDir)
  if (!genObj[pkgName]) return 0
  const lts = execSync(`npm view ${pkgName} version`) + ''
  if (genObj[pkgName] === lts.trim()) return 2
  return 1
}

module.exports = {
  getInstalledPkgs,
  getInstalledStatus
}
