const debug = require('debug')('user-service:claims-data-facade')
const toValidJSON = require('../util/toValidJSON')

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const create = async (db, claims) => {
  try {
    const data = await db('claims').insert(claims).returning('*')
    return data
  } catch (err) {
    debug(err)
    return err
  }
}

const get = async (db, params = { first: 25 }) => {
  try {
    const data = await db('claims')
      .modify(qb => {
        if (params.limit) {
          qb.limit(params.limit)
        }
        if (params.orderBy) {
          qb.orderBy(params.orderBy, 'asc')
        }
        if (params.userId) {
          qb.where({ id: params.userId })
        }
        if (params.where) {
          qb.where(params.where)
        }
        if (params.returning) {
          qb.returning(params.returning)
        } else {
          qb.select('*')
        }
      })
    const json = toValidJSON(data)
    return json
  } catch (err) {
    return err
  }
}

const remove = async (db, params = {}) => {
  try {
    if (params.id) {
      return await db('claims')
        .del()
        .where({ id: params.id })
    } else {
      return
    }
  } catch (err) {
    throw new Error(err)
  }
}

const update = async (db, id, claim) => {
  const newClaim = {}
  Object.keys(claim).forEach(key => {
    newClaim[capitalizeFirstLetter(key)] = claim[key]
  })
  if (newClaim.id) {
    delete newClaim.id
  }
  try {
    if (id) {
      return await db('users')
        .update(newClaim)
        .where({ id: id })
        .returning('*')
    }
  } catch (err) {
    debug(err)
  }
}

module.exports = {
  create,
  get,
  remove,
  update
}
