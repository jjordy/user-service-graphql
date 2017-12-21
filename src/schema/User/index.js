const ValidationError = require('../../util/ValidationError')
const debug = require('debug')('graphql-api:data-facade')
const publicColumns = require('../../util/publicColumns')
const { createCursor, decodeCursor } = require('../../util')
const toValidJSON = require('../../util/toValidJSON')
const validateRequiredClaims = require('../../util/validateRequiredClaims')

class User {
  constructor ({ db, user }) {
    this.db = db
    this.user = user || null
  }

  async getAll (first = 25, after) {
    // await validateRequiredClaims('DEFAULT', 'CAN_EDIT_PROFILE', this.user)
    const cursor = await decodeCursor(after)
    const data = await this.db('users')
      .select(publicColumns)
      .where('cursor', '>', cursor)
      .limit(first)
      .orderBy('CreatedOn', 'asc')
    const newCursor = await createCursor(data)
    const json = toValidJSON(data)
    return { data: json, cursors: newCursor }
  }

  async getUserClaims (userId) {
    const user = await this.db('users')
      .select('Claims')
      .where({ id: userId })
    return user[0].Claims
  }

  async getOne (userId) {
    try {
      const user = await this.db('users')
        .first()
        .select(publicColumns)
        .where({ id: userId })
      return user
    } catch (err) {
      throw new ValidationError([
        { key: 'userId', message: 'User Not Found' }
      ])
    }
  }
  async findByEmail (email) {
    const existingUser = await this.db('users')
      .first()
      .where({ Email: email })
    return existingUser
  }

  async update (id, user) {
    const updated = await this.db('users')
      .where({ id: id })
      .update(user)
      .returning(publicColumns)
    debug(`User ${id} Updated`)
    return updated[0]
  }
  async remove (id) {
    await this.db('users')
      .where({ id: id })
      .del()
    debug(`User ${id} Removed`)
    return { id }
  }
}

module.exports = User
