// _ === parent attr

const auth = require('../util/auth')

const resolvers = {
  Query: {
    users (_, props, { userService }) {
      return userService.getAll(props.first, props.after, props.userId)
    },
    user (_, props, { userService }) {
      return userService.getOne(props.userId)
    },
    userByEmail (_, props, { userService }) {
      return userService.findByEmail(props.email)
    },
    claimsByUserId (_, props, { claimsService }) {
      return claimsService.getClaimsByUserId(props.userId)
    },
    claims (_, props, { claimsService }) {
      return claimsService.getAll(props)
    }
  },
  Mutation: {
    loginUser (_, { input }, { db }) {
      return auth.login(db, input)
    },
    createUser (_, { input }, { db }) {
      return auth.createUser(db, input)
    },
    updateUser (_, { userId, input }, { userService }) {
      return userService.update(userId, input)
    },
    removeUser (_, { userId }, { userService }) {
      return userService.remove(userId)
    }
  }
}

module.exports = resolvers
