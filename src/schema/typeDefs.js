const User = require('./User/type')
const Claims = require('./Claims/type')
const cursors = require('./Cursor/type')

const typeDefs = `

type Token {
  token: String!
}

type userRes {
  data: [User]!
  cursors: cursors
}

type Query {
  claims: [Claim]
  claimsByUserId(userId: String): [Claim]
  cursors: cursors
  users(userId: String, first: Int, after: String): userRes
  userByEmail(email: String): User
  user(userId: String!): User

}

type Mutation {
  createClaims(input: [ClaimInput]): [Claim]
  createUser(input: CreateUserInput!): User
  loginUser(input: LoginUserInput): Token
  removeUser(userId: String!): User
  removeClaims(input: [ClaimInput]): [Claim]
  updateClaims(input: [ClaimInput]): [Claim]
  updateUser(userId: String !input: UserInput!): User
}

# this schema allows the following mutation:
# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: Query
  mutation: Mutation
}
`

module.exports = [typeDefs, ...User, Claims, cursors]
