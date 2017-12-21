const ValidationError = require('../../util/ValidationError')
const debug = require('debug')('user-service:data-facade')
const toValidJSON = require('../../util/toValidJSON')

class Claims {
  constructor ({ db, user }) {
    this.db = db
    this.user = user
  }
  async createClaims (claims) {
    try {
      const data = this.db('claims').insert(claims)
      const json = toValidJSON(data)
      return { claims: json }
    } catch (err) {
      debug(err)
      throw new ValidationError(err)
    }
  }
  async getAll (userId) {
    try {
      const data = await this.db('claims')
        .select('*')
        .where({UserId: userId})
      const json = toValidJSON(data)
      return { claims: json }
    } catch (err) {
      debug(err)
      throw new ValidationError(err)
    }
  }
}

module.exports = Claims
