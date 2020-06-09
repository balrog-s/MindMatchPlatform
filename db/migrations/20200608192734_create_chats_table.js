
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists("core.users_chats", t => {
    t.uuid('id').notNull().unique();
    t.uuid('created_by').notNull();
    t.enum('status', ['ACTIVE', 'BLOCKED', 'INACTIVE']).notNull();
    t.timestamps(null, true);
    t.foreign('created_by')
      .references('id')
      .inTable('core.users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("core.users_chats");
};
