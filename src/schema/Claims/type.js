const Claims = `
  type Claim {
    id: String!
    userId: String!
    claimType: String!
    claimValue: String!
  }
  input ClaimInput {
    userId: String!
    id: String
    claimType: String!
    claimValue: String!
  }
`

module.exports = Claims
