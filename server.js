require('dotenv').config()

const debug = require('debug')('user-service:http')
const app = require('./src/app')()

app.listen(process.env.PORT || 4000, () => {
  debug(`Running a GraphQL API server at localhost:${process.env.PORT || 4000}/graphql`)
})
