const debug = require('debug')('user-service:seed')
const { createUser } = require('../src/util/auth')
const Claims = require('../src/schema/Claims')
const faker = require('faker')
const uuid = require('uuid')

const defaultClaims = [
  {
    ClaimType: 'access',
    ClaimValue: 'CAN_VIEW_PROFILE',
    id: uuid.v4()
  },
  {
    ClaimType: 'access',
    ClaimValue: 'CAN_EDIT_PROFILE',
    id: uuid.v4()
  }
]

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
  const claims = new Claims({db, user: {}})
  const existingUsers = await db('users').returning('id')
  if (existingUsers.length === 0) {
    try {
      await db('users').del()
      const promises = []
      createUsers().forEach(user =>
        promises.push(createUser(db, user))
      )
      const users = await Promise.all(promises)
      const ids = users.map(user => user.id)
      const newClaims = ids.map(id => ({UserId: id, ...defaultClaims}))
      await claims.createClaims(newClaims)
    } catch (err) {
      debug(err)
    }
    debug('Created Test Users')
  }
}
