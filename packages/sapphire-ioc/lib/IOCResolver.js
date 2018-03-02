/**
 * This function takes an IOC instance and a key value object
 * and returns an object with getters from both parameters.
 * On IOC returns the services that are registered.
 *
 * @module sapphire/ioc
 * @param {IOC} ioc
 * @param {object} plainResolvers
 */
const iocResolver = (ioc, plainResolvers = {}) => {
  let iocResolver = {}

  ioc.allIdentifiers().map(identifier => {
    Object.defineProperty(
      iocResolver,
      identifier,
      { get: () => ioc.make(identifier) }
    )
  })

  Object.keys(plainResolvers).map(plainResolverKey => {
    Object.defineProperty(
      iocResolver,
      plainResolverKey,
      { get: () => plainResolvers[plainResolverKey] }
    )
  })

  ioc.get

  return iocResolver
}

module.exports = iocResolver
