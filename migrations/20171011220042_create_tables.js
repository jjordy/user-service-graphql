exports.up = async db => {
  await db.schema.createTable('users', table => {
    table
      .uuid('id')
      .notNullable()
      .primary()
    table.string('FirstName', 100)
    table.string('LastName', 100)
    table.string('Username', 100).notNullable()
    table.string('Email').notNullable()
    table.boolean('LockoutEnabled').defaultTo(false)
    table.dateTime('LockoutEnd')
    table
      .boolean('EmailConfirmed')
      .notNullable()
      .defaultTo(false)
    table.string('PhoneNumber', 14)
    table
      .boolean('PhoneNumberConfirmed')
      .notNullable()
      .defaultTo(false)
    table.string('Password')
    table
      .boolean('TwoFactorEnabled')
      .notNullable()
      .defaultTo(false)
    table.dateTime('CreatedOn').defaultTo(db.raw('CURRENT_DATE'))
    table.dateTime('UpdatedOn').defaultTo(db.raw('CURRENT_DATE'))
    table
      .string('CreatedBy')
      .notNullable()
      .defaultTo('System')
    table
      .string('UpdatedBy')
      .notNullable()
      .defaultTo('System')
  })
}

exports.down = async db => {
  await db.schema.dropTableIfExists('users')
}
