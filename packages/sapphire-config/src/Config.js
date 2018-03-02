class Config {
  constructor(configFolder = 'config', preload = false) {
    this._cache = {}
    this._configFolder = configFolder
  }

  get(key) {
    const arrayOfKeys = key.trim().split('.')

    if(arrayOfKeys.legth === 0)
      return null

    const keyFromCache = this._iterate(arrayOfKeys, this._cache)
    if(keyFromCache)
      return keyFromCache

    const configFile = require(this._configFolder + arrayOfKeys[0])
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

  _cacheConfig(key, value) {
    const newPlainObject = {}
    newPlainObject[key] = value
    this._cache = {...this._cache, ...newPlainObject}
  }
}

module.exports = Config
