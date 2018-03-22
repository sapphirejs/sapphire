const { Route } = require('@sapphirejs/router')
const { Container } = require('@sapphirejs/container')
const { Request } = require('@sapphirejs/request')
const Response = require('@sapphirejs/response')
const { ExpressConsumer } = require('../index')
const SampleErrorHandler = require('./helpers/SampleErrorHandler')
const ExampleMiddleware = require('./helpers/ExampleMiddleware')
const axios = require('axios')
axios.defaults.baseURL = 'http://localhost:4000'
const { test, expect } = global

const generateExpressConsumer = (handler = null, container = null) => new ExpressConsumer({
  publicFolder: '/public',
  port: 4000,
}, handler, container)

test('Test', () => {

  const errorHandler = new SampleErrorHandler()
  const container = new Container()

  expect(() => {
    new ExpressConsumer({
      publicFolder: '/public',
    }, errorHandler, container)
  }).toThrow()

  expect(() => {
    new ExpressConsumer({
      port: 4000,
    }, errorHandler, container)
  }).toThrow()

  expect(() => {
    new ExpressConsumer({}, errorHandler, container)
  }).toThrow()

  expect(() => {
    new ExpressConsumer({}, errorHandler, 'not.a.container')
  }).toThrow()
})

test('Bad error handler throws error', () => {
  expect(() => {
    generateExpressConsumer(
      new class ExampleHandler {
      }, new Container()
    )
  }).toThrow()
})

test('Add routes on express', async () => {
  const expressConsumer = generateExpressConsumer(
    new SampleErrorHandler(), new Container()
  )

  const route = new Route()

  route.group('/some-group', (route) => {
    /**
     * @param {Request} Request
     * @param {Response} Response
     */
    route.get('/lol', [({Request, Response}, next) => { console.log('lol')}, ({Request, Response}, next) => { console.log("Else")}], ({ Request, Response }) => {
      //throw new Error()
      return Response.json({ route: Request.route.path })
    })
  })

  expressConsumer.createRoutes(route.export())
  expressConsumer.start()

  const response = await axios.get('/some-group/lol').then(resp => resp.data) //.then(resp => console.log(resp)).catch(error => error)

  expect(response).toEqual({ route: '/some-group/lol' })

  expressConsumer.close()
})
