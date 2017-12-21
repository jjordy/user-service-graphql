const jwt = require('jsonwebtoken')
const ValidationError = require('../ValidationError')
const toValidJSON = require('../toValidJSON')
const { decryptPassword } = require('./passwords')

const login = async (db, user) => {
  const u = await db('users')
    .first()
    .where({ Email: user.email })
    .returning(['Password', 'Email', 'FirstName', 'LastName', 'Password', 'id'])
  const c = await db('claims')
    .where({ UserId: u.id })
    .returning('*')
  if (u) {
    const matches = await decryptPassword(user.password, u.Password)
    if (matches) {
      const payload = toValidJSON(u)
      const claims = toValidJSON(c)
      delete payload.password
      const token = jwt.sign(
        {
          ...payload,
          claims
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRIATION || '7d' }
      )
      return { token }
    } else {
      throw new ValidationError([{ key: 'email', message: 'User Not Found' }])
    }
  } else {
    throw new ValidationError([{ key: 'email', message: 'User Not Found' }])
  }
}

module.exports = login
