/**
 * This function takes a Container instance and a key value object,
 * and returns an object with getters from both parameters.
 * On IOC returns the services that are registered.
 *
 * @param {Container} container
 * @param {Object} resolvers
 */
const resolver = (container, resolvers = {}) => {
  let result = {}

  container.identifiers().map(identifier => {
    Object.defineProperty(
      result,
      identifier,
      { get: () => container.resolve(identifier) }
    )
  })

  Object.keys(resolvers).map(key => {
    Object.defineProperty(
      result,
      key,
      { get: () => resolvers[key] }
    )
  })

  return result
}

module.exports = resolver
