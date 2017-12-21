exports.up = async db => {
  await db.schema.createTable('claims', table => {
    table
      .uuid('id')
      .notNullable()
      .primary()
    table.string('ClaimType', 100).notNullable()
    table.string('ClaimValue', 100).notNullable()
    table.uuid('UserId').notNullable()
  })
}

exports.down = async db => {
  await db.schema.dropTableIfExists('claims')
}
