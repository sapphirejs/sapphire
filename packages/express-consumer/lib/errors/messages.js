const configExample = `{
  cors: true,
  publicFolder: '/public',
  port: 4000,
}`

const errorHandler = `class SampleErrorHandler {
  handle() {
    
  }
}`

module.exports = {
  shouldBeObject: () => ({
    title: `The configuration argument should be an object`,
    code: configExample
  }),
  shouldHaveKey: (key) => ({
    title: `Config object should have: ${key}`,
    code: configExample
  }),
  errorHandler: () => ({
    title: 'Error handler should be an object and have a handle method',
    code: errorHandler
  }),
  container: () => ({
    title: 'Container should be an instance of sapphire container',
    code: ''
  })
}
