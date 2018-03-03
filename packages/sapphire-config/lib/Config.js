const fs = require('fs')
const BadArguments = require('./BadArguments')

class Config {
  constructor(configFolder = '/config', preload = false) {
    configFolder = process.cwd() + configFolder

    if(!this._validateConfigFolder(configFolder))
      throw new BadArguments("Bad config folder argument")

    if(!this._validatePreload(preload))
      throw new BadArguments("Bad preload parameter. It should be an boolean value")

    this._cache = {}
    this._configFolder = configFolder

    if(preload === true)
      this._preload()
  }

  get(key = '') {
    const arrayOfKeys = key.trim().split('.')

    if(arrayOfKeys[0] === '')
      return null

    const keyFromCache = this._iterate(arrayOfKeys, this._cache)
    if(keyFromCache)
      return keyFromCache

    const configFile = require(this._configFolder + '/' + arrayOfKeys[0])
    const keysForConfig = [...arrayOfKeys]
    const keyFromConfig = this._iterate(keysForConfig.splice(1), configFile)
    if(!keyFromConfig)
      return null

    this._cacheConfig(arrayOfKeys[0], configFile)
    return keyFromConfig
  }

  _iterate(arrayOfKeys, objectToIterate) {
    return arrayOfKeys.reduce(
      (acumulator, key) =>
        acumulator !== null && acumulator.hasOwnProperty(key)
          ? acumulator[key]
          : null
      , objectToIterate
    )
  }

  _preload() {

  }

  _validatePreload(preload) {
    return ((typeof preload) === 'boolean')
  }

  _validateConfigFolder(configFolder) {
    try{
      fs.lstatSync(configFolder).isDirectory()
    }catch(e){
      return false
    }
    return true
  }

  _cacheConfig(key, value) {
    const newPlainObject = {}
    newPlainObject[key] = value
    this._cache = {...this._cache, ...newPlainObject}
  }
}

module.exports = Config
