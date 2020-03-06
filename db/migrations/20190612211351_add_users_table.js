
exports.up = function(knex) {
    return knex.raw(`CREATE SCHEMA IF NOT EXISTS "core";`)
    .then(() => knex.schema.createTableIfNotExists("core.users", t => {
        t.string('username').notNull().unique();
        t.string('first_name').notNull();
        t.string('last_name').notNull();
        t.string('email').notNull().unique();
        t.uuid('id').notNull().unique();
        t.string('password').notNull();
        t.timestamps(null, true);
    }));
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("core.users")
    .then(() => knex.raw(`DROP SCHEMA IF EXISTS "core";`));
};
