const { GraphQLError } = require('graphql')

class NotAuthorizedError extends GraphQLError {
  constructor (state) {
    super('User not authorized for this request')
    this.state = {
      statusCode: 401
    }
  }
}

module.exports = NotAuthorizedError
