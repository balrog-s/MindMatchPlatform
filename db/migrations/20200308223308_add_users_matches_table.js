
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("core.users_matches", t => {
    t.uuid('id').notNull();
    t.string('initiator_user_id').notNull();
    t.string('requested_user_id').notNull();
    t.enum('status', ['APPROVED', 'REJECTED', 'BLOCKED', 'PENDING']).notNull();
    t.timestamps(null, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists("core.users_matches");
};
