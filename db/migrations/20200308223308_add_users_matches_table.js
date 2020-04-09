
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("core.users_matches", t => {
    t.uuid('id').notNull();
    t.uuid('initiator_user_id').notNull();
    t.uuid('requested_user_id').notNull();
    t.enum('status', ['APPROVED', 'REJECTED', 'BLOCKED', 'PENDING']).notNull();
    t.timestamps(null, true);
    t.foreign('initiator_user_id')
      .references('id')
      .inTable('core.users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    t.foreign('requested_user_id')
      .references('id')
      .inTable('core.users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists("core.users_matches");
};
