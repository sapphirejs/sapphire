const fs = require('fs')
const fsPath = require('path')

/**
 * Read config files in a directory and
 * outputs an object.
 *
 * @param {string} directory
 */
const readConfigDir = (directory) => {
  try {
    const realDir = fsPath.join(process.cwd(), directory)
    const files = fs.readdirSync(realDir)
    let output = {}

    files.forEach(file => {
      if (fsPath.extname(file) === '.js') {
        const object = require(`${realDir}/${file}`)
        output[fsPath.basename(file, '.js')] = object
      }
    })
  }
  catch(err) {
    return false
  }
}

module.exports = readConfigDir
