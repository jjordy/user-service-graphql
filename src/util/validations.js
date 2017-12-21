const ValidationError = require('./ValidationError')

const camelToTitle = str => str.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())

const validator = require('validator')
const join = rules => (value, data, key) =>
  rules.map(rule => rule(value, data, key)).filter(error => !!error)[0]

exports.required = (value, data, key) => {
  if (!value || validator.isEmpty(value)) {
    return { key, message: `${camelToTitle(key)} is Required` }
  }
}

exports.isUUID = (value, data, key) => {
  if (!value || !validator.isUUID(value)) {
    return { key, message: `Should be a valid UUID` }
  }
}

exports.isURL = (value, data, key) => {
  if (!value || !validator.isURL(value)) {
    return { key, message: `${camelToTitle(key)} must be a valid URL` }
  }
}

exports.isEmail = (value, data, key) => {
  if (!value || !validator.isEmail(value)) {
    return { key, message: `${camelToTitle(key)} must be a valid Email Address` }
  }
}

exports.createValidator = (rules) => {
  return (data = {}) => {
    const errors = []
    Object.keys(rules).forEach(key => {
      const rule = join([].concat(rules[key]))
      const test = rule(data[key], data, key)
      if (test !== undefined) errors.push(test)
    })
    if (errors.length) throw new ValidationError(errors)
  }
}
