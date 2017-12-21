const debug = require('debug')('user-service:authentication-service:createUser')
const { createValidator, isEmail, required } = require('../validations')
const publicColumns = require('../publicColumns')
const userExists = require('./userExists')
const { encryptPassword } = require('./passwords')
const uuid = require('uuid')

const createUser = async (db, user) => {
  createValidator({
    email: [required, isEmail],
    password: [required],
    confirmPassword: [required]
  })(user)
  user.email = user.email.toLowerCase()
  await userExists(db, user.email)
  try {
    const pass = await encryptPassword(user.password)
    const newUser = await db('users')
      .insert({
        id: uuid.v4(),
        Email: user.email,
        Username: user.email,
        FirstName: user.firstName,
        LastName: user.lastName,
        PhoneNumber: user.phoneNumber,
        Password: pass
      })
      .returning(publicColumns)
    return newUser[0]
  } catch (err) {
    debug(err)
  }
}

module.exports = createUser
