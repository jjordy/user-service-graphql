const debug = require('debug')('user-service:user-data-facade')
const publicColumns = require('../util/publicColumns')
const toValidJSON = require('../util/toValidJSON')

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const get = async (db, params = {orderBy: 'createdOn', first: 25}) => {
  try {
    const data = await db('users')
      .select(publicColumns)
      .modify(qb => {
        if (params.limit) {
          qb.limit(params.limit)
        }
        if (params.orderBy) {
          qb.orderBy(params.orderBy, 'asc')
        }
        if (params.cursor) {
          qb.where('cursor', '>', params.cursor)
        }
        if (params.userId) {
          qb.where({id: params.userId})
        }
        if (params.where) {
          qb.where(params.where)
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
      return await db('users').del().where({id: params.id})
    } else {
      return
    }
  } catch (err) {
    throw new Error(err)
  }
}

const update = async (db, id, user) => {
  const newUser = {}
  Object.keys(user).forEach(key => {
    newUser[capitalizeFirstLetter(key)] = user[key]
  })
  if (newUser.id) {
    delete newUser.id
  }
  try {
    if (id) {
      return await db('users').update(newUser).where({id: id}).returning(publicColumns)
    }
  } catch (err) {
    debug(err)
  }
}

module.exports = {
  get,
  remove,
  update
}
