const ValidationError = require('./ValidationError')
const uuid = require('uuid')
const debug = require('debug')('user-service:authentication-service')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Claims = require('../schema/Claims')
const { createValidator, isEmail, required } = require('./validations')
const publicColumns = require('./publicColumns')
const saltRounds = 10
const camelCaseKeys = require('camelcase-keys')

exports.createUser = async (db, user) => {
  // validate input
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
      }).returning(publicColumns)
    return newUser[0]
  } catch (err) {
    debug(err)
  }
}

exports.login = async (db, user) => {
  console.log(user)
  const u = await db('users')
    .first()
    .where({ Email: user.email })
    .returning(['Password', 'Email', 'FirstName', 'LastName', 'Password'])
  if (u) {
    const matches = await decryptPassword(user.password, u.Password)
    if (matches) {
      const payload = camelCaseKeys(u, { deep: true })
      delete payload.password
      const token = jwt.sign({
        ...payload
      }, process.env.JWT_SECRET, { expiresIn: '7d' })
      return { token }
    } else {
      throw new ValidationError([{key: 'email', message: 'User Not Found'}])
    }
  } else {
    throw new ValidationError([{key: 'email', message: 'User Not Found'}])
  }
}

const userExists = async (db, email) => {
  const user = await db('users').select('id').where({ Email: email })
  if (user && user.length > 0) {
    throw new ValidationError([{key: 'email', message: 'User already exists'}])
  } else {
    return false
  }
}

const encryptPassword = password => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        debug(err)
        reject(err)
      }
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          debug(err)
          reject(err)
        }
        resolve(hash)
      })
    })
  })
}

const decryptPassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, res) {
      if (err) reject(err)
      resolve(res)
    })
  })
}
