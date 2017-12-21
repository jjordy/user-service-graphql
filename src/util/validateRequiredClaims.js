const NotAuthorizedError = require('./NotAuthorizedError')

module.exports = async function (claimType, claimValue, user) {
  if (user && user.claims) {
    const match = user.claims.find(claim => {
      if (claim.claimType === claimType && claim.claimValue === claimValue) {
        return true
      } else {
        return false
      }
    })
    if (!match) {
      throw new NotAuthorizedError()
    }
  } else {
    throw new NotAuthorizedError()
  }
}
