const debug = require('debug')('user-service:seed')
const { createUser } = require('../src/util/auth')
const Claims = require('../src/schema/Claims')
const faker = require('faker')
const uuid = require('uuid')

const canViewClaim = {
  ClaimType: 'access',
  ClaimValue: 'CAN_VIEW_PROFILE'
}

const canEditClaim = {
  ClaimType: 'access',
  ClaimValue: 'CAN_EDIT_PROFILE'
}

const getUsers = {
  ClaimType: 'access',
  ClaimValue: 'GET_ALL_USERS'
}

const editUsers = {
  ClaimType: 'access',
  ClaimValue: 'EDIT_ALL_USERS'
}

const deleteUsers = {
  ClaimType: 'access',
  ClaimValue: 'DELETE_ALL_USERS'
}

const createUsers = () => {
  const users = [
    {
      email: 'jordanrileyaddison@gmail.com',
      password: 'test',
      confirmPassword: 'test',
      firstName: 'Jordan',
      lastName: 'Addison',
      phoneNumber: '2285470060'
    },
    {
      email: 'jordanaddison@globalfas.com',
      password: 'test',
      confirmPassword: 'test',
      firstName: 'Jordan',
      lastName: 'Addison',
      phoneNumber: '2285470060'
    }
  ]

  const total = 1

  for (var i = 0; i < total; i++) {
    const p = faker.internet.password()
    users.push({
      email: faker.internet.email(),
      password: p,
      confirmPassword: p,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    })
  }

  return users
}

exports.seed = async db => {
  if (process.env.NODE_ENV === 'development') {
    const claims = new Claims({ db, user: {} })
    try {
      await db('users').del()
      await db('claims').del()
      const promises = []
      const newClaims = []
      createUsers().forEach(user => {
        promises.push(createUser(db, user))
      })
      const users = await Promise.all(promises)
      users.forEach(user => {
        newClaims.push(Object.assign({}, { UserId: user.id, ...canViewClaim, id: uuid.v4() }))
        newClaims.push(Object.assign({}, { UserId: user.id, ...canEditClaim, id: uuid.v4() }))
        newClaims.push(Object.assign({}, { UserId: user.id, ...getUsers, id: uuid.v4() }))
        newClaims.push(Object.assign({}, { UserId: user.id, ...editUsers, id: uuid.v4() }))
        newClaims.push(Object.assign({}, { UserId: user.id, ...deleteUsers, id: uuid.v4() }))
      })
      await claims.createClaims(newClaims)
    } catch (err) {
      debug(err)
    }
    debug('Created Test Users')
  }
}
