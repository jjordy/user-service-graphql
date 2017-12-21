const path = require('path')
// Appends type information to an object, e.g. { id: 1 } => { __type: 'User', id: 1 };
function assignType (obj, type) {
  // eslint-disable-next-line no-param-reassign, no-underscore-dangle
  obj.__type = type
  return obj
}

function mapTo (keys, keyFn, type, rows) {
  if (!rows) return mapTo.bind(null, keys, keyFn, type)
  const group = new Map(keys.map(key => [key, null]))
  rows.forEach(row => group.set(keyFn(row), assignType(row, type)))
  return Array.from(group.values())
}

function mapToMany (keys, keyFn, type, rows) {
  if (!rows) return mapToMany.bind(null, keys, keyFn, type)
  const group = new Map(keys.map(key => [key, []]))
  rows.forEach(row => group.get(keyFn(row)).push(assignType(row, type)))
  return Array.from(group.values())
}

function mapToValues (keys, keyFn, valueFn, rows) {
  if (!rows) return mapToValues.bind(null, keys, keyFn, valueFn)
  const group = new Map(keys.map(key => [key, null]))
  rows.forEach(row => group.set(keyFn(row), valueFn(row)))
  return Array.from(group.values())
}

function resolveLogPath () {
  if (process.env.LOGS_PATH) {
    return path.join(process.env.LOGS_PATH, 'dbErrors.log')
  } else {
    return path.join(__dirname, '..', '..', 'dbErrors.log')
  }
}

async function createCursor (items = []) {
  try {
    const cursor = items.slice(-1)[0].cursor
    const after = Buffer.from(cursor).toString('base64')
    return { after }
  } catch (err) {
    return { after: 'MzA=' }
  }
}

async function decodeCursor (cursor = 'MzA=') {
  let after
  try {
    if (cursor) {
      after = Buffer.from(cursor, 'base64').toString('utf8')
    } else {
      after = '0'
    }
    return parseInt(after, 10)
  } catch (err) {
    return err
  }
}

module.exports = {
  assignType,
  createCursor,
  decodeCursor,
  mapTo,
  mapToMany,
  mapToValues,
  resolveLogPath
}
