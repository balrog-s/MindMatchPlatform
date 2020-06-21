
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists("core.users_messages", t => {
    t.uuid('id').notNull().unique();
    t.uuid('chat_id').notNull();
    t.string('payload').notNull();
    t.uuid('created_by').notNull();
    t.timestamps(null, true);
    t.foreign('chat_id')
      .references('id')
      .inTable('core.users_chats')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.foreign('created_by')
      .references('id')
      .inTable('core.users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("core.users_messages");
};
