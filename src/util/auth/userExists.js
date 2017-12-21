const ValidationError = require('../ValidationError')

const userExists = async (db, email) => {
  const user = await db('users')
    .select('id')
    .where({ Email: email })
  if (user && user.length > 0) {
    throw new ValidationError([{ key: 'email', message: 'User already exists' }])
  } else {
    return false
  }
}

module.exports = userExists
