const debug = require('debug')('user-service:authentication-service:password-helpers')
const bcrypt = require('bcrypt')

const saltRounds = 10

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

module.exports = {
  encryptPassword,
  decryptPassword
}
