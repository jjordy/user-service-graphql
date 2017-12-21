const express = require('express')
const cors = require('cors')
const knexfile = require('../knexfile')
const knex = require('knex')
const schema = require('./schema')
const initDb = require('./util/initDb')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const bodyParser = require('body-parser')
const debug = require('debug')('user-service:App')
const winston = require('winston')
const { resolveLogPath } = require('./util')
const app = express()
const db = knex(knexfile)
const jwt = require('express-jwt')
const UserService = require('./schema/User')
const ClaimsService = require('./schema/Claims')
const isProd = process.env.NODE_ENV === 'production'

const transports = [
  new winston.transports.File({
    filename: resolveLogPath(),
    level: 'error',
    silent: isProd
  })
]

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: transports
})

async function initializeDatabase () {
  try {
    await initDb(db)
  } catch (err) {
    debug(err)
    logger.log('error', err.toString())
  }
}

initializeDatabase()

const App = () => {
  app.use('*', cors())

  app.use('*', (req, res, next) => {
    debug('Request Received')
    next()
  })

  app.use(
    jwt({
      secret: process.env.JWT_SECRET,
      credentialsRequired: false,
      getToken: function fromHeaderOrQuerystring (req) {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
          return req.headers.authorization.split(' ')[1]
        } else if (req.query && req.query.token) {
          return req.query.token
        }
        return null
      }
    })
  )

  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(req => ({
      schema,
      formatError: error => ({
        message: error.message,
        state: error.originalError && error.originalError.state,
        locations: error.locations,
        path: error.path
      }),
      graphiql: true,
      context: {
        db,
        claimsService: new ClaimsService({ db, user: req.user }),
        userService: new UserService({ db, user: req.user }),
        logger
      }
    }))
  )
  return app
}

module.exports = App
