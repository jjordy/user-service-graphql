const Claims = require('../Claims/type')
const cursors = require('../Cursor/type')

const User = `
  type User {
    id: String!
    firstName: String!
    lastName: String!
    cursors: cursors!
    email: String!
    claims: [Claim]
    phoneNumber: String
  }
  input CreateUserInput {
    firstName: String
    lastName: String
    email: String!
    password: String!
    confirmPassword: String!
    phoneNumber: String
  }
  input UserInput {
    email: String
    firstName: String
    lastName: String
    phoneNumber: String
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  input ForgotPasswordInput {
    email: String!
  }

  input ResetPasswordInput {
    id: String!
    password: String!
    confirmPassword: String!
    token: String!
  }
`

module.exports = [User, Claims, cursors]
