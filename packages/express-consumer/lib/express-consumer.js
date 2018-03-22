const { Request, Adapter } = require('@sapphirejs/request')
const Response = require('@sapphirejs/response')
const { Container, resolver } = require('@sapphirejs/container')

const express = require('express')
const cors = require('cors')
const is = require('is')

const ExpressConsumerInvalidArgument = require('./errors/express-consumer-invalid-arguments')
const ExpressResponseConsumer = require('./express-response-consumer')
const message = require('./errors/messages')
const { objectHasMethod } = require('./helpers')

const methods = {
  get: 'get',
  post: 'post',
  put: 'put',
  patch: 'patch',
  delete: 'delete'
}

const type = {
  http: 'http',
  command: 'command'
}

/**
 * ExpressConsumer class.
 * Consume a router and build an express server.
 *
 * @class ExpressConsumer
 */
class ExpressConsumer {
  /**
   *
   * @param {Object} config
   * @param {Object} errorHandler
   * @param {Container} container
   * @throws {ExpressConsumerInvalidArgument} if arguments are invalid
   */
  constructor(config = null, errorHandler = null, container = null) {
    this.__config = config
    this.__errorHandler = errorHandler
    this.__container = container
    this.__httpInstance = null
    this.__validateConfig()
    this.__validateErrorHandler()
    this.__validateContainer()
    this.__initExpress()
  }

  /**
   * Validates the config.
   *
   * @private
   * @throws {ExpressConsumerInvalidArgument} if config is invalid
   */
  __validateConfig() {
    const config = this.__config

    if(!is.object(config))
      throw new ExpressConsumerInvalidArgument(
        message.shouldBeObject().title,
        message.shouldBeObject().code
      )

    const keys = ['publicFolder', 'port']
    keys.forEach((key) => {
      if(!config.hasOwnProperty(key))
        throw new ExpressConsumerInvalidArgument(
          message.shouldHaveKey(key).title,
          message.shouldHaveKey(key).code
        )
    })
  }

  /**
   *
   * @private
   */
  __validateContainer() {
    if(!(this.__container instanceof Container))
      throw new ExpressConsumerInvalidArgument(
        message.container().title,
        message.container().code,
      )
  }

  /**
   * Validates the error handler.
   *
   * @private
   * @throws {ExpressConsumerInvalidArgument}
   */
  __validateErrorHandler() {
    if( !(
            is.object(this.__errorHandler) &&
            objectHasMethod(this.__errorHandler, 'handle')
    ))
      throw new ExpressConsumerInvalidArgument(
        message.errorHandler().title,
        message.errorHandler().message,
      )
  }

  /**
   * Creates an express server.
   *
   * @private
   */
  __initExpress() {
    const { publicFolder } = this.__config
    this.__route = express()
    this.__route.use(cors())

    // this.__route.use((error, req, resp, next) => {
    //   this.__errorHandler.handle(error)
    // })

    this.__route.use(express.static(publicFolder))
  }

  /**
   * Register express routes
   *
   * @param routes
   */
  createRoutes(routes = []) {
    const router = this.__route
    routes
      .filter( route => route.type === type.http)
      .forEach( route => {
        const { path, meta, handler, middleware } = route

        console.log(middleware)

        const consumableMiddlewares = middleware.map(
          item => (req, resp, next) => {
            item(
              resolver(this.__container, {
                Request: new Request(new Adapter.Express(req)),
                Response: new Response()
              }),
              next
            )
          }
        )

        //console.log(middleware)

        if(!methods.hasOwnProperty(meta.method))
          throw new Error()

        router[meta.method](path, ...consumableMiddlewares, (req, resp) => {
          try{
            (
              new ExpressResponseConsumer(
                resp,
                handler(
                  resolver(this.__container, {
                    Request: new Request(new Adapter.Express(req)),
                    Response: new Response()
                  })
                )
              )
            ).send()
          }catch(e) {
            (
              new ExpressResponseConsumer(
                resp,
                this.__errorHandler.handle(new Response(), e)
              )
            ).send()
          }
        })

      })
  }

  /**
   * Starts an Express server.
   *
   * @returns {void}
   */
  start() {
    this.__httpInstance = this.__route.listen(this.__config.port)
  }

  /**
   * Closes the express server.
   *
   * @returns {void}
   */
  close() {
    if(this.__httpInstance)
      this.__httpInstance.close()
  }
}

module.exports = ExpressConsumer
