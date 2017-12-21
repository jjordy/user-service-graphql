const debug = require('debug')('user-service:User')
const { createCursor, decodeCursor } = require('../../util')
const ValidationError = require('../../util/ValidationError')
const validateRequiredClaims = require('../../util/validateRequiredClaims')
const userData = require('../../data/user')

class User {
  constructor ({ db, user }) {
    this.db = db
    this.user = user || null
  }

  async getAll (first = 25, after, userId = null) {
    try {
      await validateRequiredClaims('access', 'GET_ALL_USERS', this.user)
      const cursor = await decodeCursor(after)
      const data = await userData.get(this.db, { cursor, first, userId })
      const newCursor = await createCursor(data)
      return { data: data, cursors: newCursor }
    } catch (err) {
      debug(err)
      throw new ValidationError(err)
    }
  }
  async getOne (userId) {
    try {
      await validateRequiredClaims('access', 'GET_ALL_USERS', this.user)
      const data = await userData.get(this.db, { userId })
      return data[0]
    } catch (err) {
      throw new ValidationError([
        { key: 'userId', message: 'User Not Found' }
      ])
    }
  }
  async findByEmail (email) {
    await validateRequiredClaims('access', 'GET_ALL_USERS', this.user)
    const user = await userData.get(this.db, { where: { Email: email } })
    return user[0]
  }
  async update (id, user) {
    await validateRequiredClaims('access', 'EDIT_ALL_USERS', this.user)
    const updated = await userData.update(this.db, id, user)
    debug(`User ${id} Updated`)
    return updated[0]
  }
  async remove (id) {
    await validateRequiredClaims('access', 'DELETE_ALL_USERS', this.user)
    await userData.remove(this.db, { id })
  }
}

module.exports = User
