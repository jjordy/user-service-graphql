const debug = require('debug')('user-service:initDb')
const path = require('path')

let migrationRetries = 2

const runMigrations = async db => {
  try {
    await db.migrate.latest({
      directory: path.join(__dirname, '..', '..', 'migrations')
    })
    debug('DB Migrations Ran', `Environment: ${process.env.NODE_ENV}`)
  } catch (err) {
    debug(`Migrations failed will retry ${migrationRetries + 1} more times starting in 5 seconds.`)
    if (migrationRetries >= 0) {
      setTimeout(() => {
        migrationRetries--
        runMigrations(db)
      }, 5000)
    }
  }
}

const initDb = async (db) => {
  try {
    // check the connection
    debug('Testing Database Connection')
    await db.raw('select 1+1 as result')
    debug('Database Connection Successful')
    // run migrations
    await runMigrations(db)
  } catch (err) {
    debug(err)
    throw new Error(err)
  }
}

module.exports = initDb
