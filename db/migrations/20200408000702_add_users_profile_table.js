
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists("core.users_profile", t => {
    t.uuid('id').notNull().unique();
    t.uuid('user_id').notNull().unique();
    t.string('bio', 500).nullable();
    t.timestamps(null, true);
    t.foreign('user_id')
      .references('id')
      .inTable('core.users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("core.users_profile");
};
