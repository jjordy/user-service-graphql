const ValidationError = require('../../util/ValidationError')
const debug = require('debug')('user-service:data-facade')
const toValidJSON = require('../../util/toValidJSON')
const validateRequiredClaims = require('../../util/validateRequiredClaims')
const userClaims = require('../../data/claims')

class Claims {
  constructor ({ db, user }) {
    this.db = db
    this.user = user
  }
  async createClaims (claims) {
    try {
      const data = await userClaims.create(this.db, claims)
      return { claims: data }
    } catch (err) {
      debug(err)
      throw new ValidationError(err)
    }
  }

  async getAll () {
    await validateRequiredClaims('access', 'GET_ALL_USERS', this.user)
    try {
      return await userClaims.get(this.db)
    } catch (err) {
      debug(err)
      throw new ValidationError(err)
    }
  }
  async getClaimsByUserId (userId) {
    await validateRequiredClaims('access', 'GET_ALL_USERS', this.user)
    try {
      return await userClaims.get(this.db, {where: {UserId: userId}})
    } catch (err) {
      debug(err)
      throw new ValidationError(err)
    }
  }
}

module.exports = Claims
