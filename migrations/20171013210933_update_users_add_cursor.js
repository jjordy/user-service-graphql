exports.up = async db => {
  await db.raw('alter table "users" add column "cursor" bigserial')
}

exports.down = async db => {
  const table = await db.schema.table('users')
  table.dropColumn('cursor')
}
