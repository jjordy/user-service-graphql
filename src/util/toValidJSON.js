const camelcaseKeys = require('camelcase-keys')

function toValidJSON (collection) {
  if (Array.isArray(collection)) {
    return collection.map(item => {
      return Object.assign({}, camelcaseKeys(item, { deep: true }))
    })
  } else {
    return Object.assign({}, camelcaseKeys(collection, {deep: true}))
  }
}

module.exports = toValidJSON
