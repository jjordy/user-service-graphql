const camelcaseKeys = require('camelcase-keys')

function toValidJSON (collection = []) {
  return collection.map(item => {
    return Object.assign({}, camelcaseKeys(item, { deep: true }))
  })
}

module.exports = toValidJSON
