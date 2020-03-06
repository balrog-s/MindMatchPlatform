
exports.up = function(knex) {
    return knex.raw(`CREATE SCHEMA IF NOT EXISTS "event_sourcing";`)
    .then(() => knex.schema.createTableIfNotExists('event_sourcing.event_store', t => {
        t.uuid('id').notNull().unique();
        t.enum('event_type', ['CREATED_USER', 'UPDATED_USER', 'DELETED_USER', 'LOGGED_USER_IN', 'LOGGED_USER_OUT']).notNull();
        t.jsonb('payload');
        t.timestamps(null, true);
        t.uuid('created_by').notNull();
        t.uuid('stream_id').notNull();
        t.integer('stream_version').defaultsTo(1);
        t.index('stream_id');
    }));
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('event_sourcing.event_store')
    .then(() => knex.raw(`DROP SCHEMA IF EXISTS "event_sourcing";`));
};
