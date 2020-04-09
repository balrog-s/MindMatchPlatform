
exports.up = function (knex) {
  return knex.raw(`
ALTER TABLE event_sourcing.event_store DROP CONSTRAINT event_store_event_type_check;
ALTER TABLE event_sourcing.event_store ADD CONSTRAINT event_store_event_type_check CHECK ((event_type = ANY (ARRAY['CREATED_USER'::text, 'UPDATED_USER'::text, 'DELETED_USER'::text, 'LOGGED_USER_IN'::text, 'LOGGED_USER_OUT'::text, 'MATCH_REQUESTED'::text, 'MATCH_REJECTED'::text, 'MATCH_APPROVED'::text, 'MATCH_BLOCKED'::text, 'CREATED_PROFILE'::text, 'UPDATED_PROFILE'::text])))`);
};

exports.down = function (knex) {
  return knex.raw(`
ALTER TABLE event_sourcing.event_store DROP CONSTRAINT event_store_event_type_check;
ALTER TABLE event_sourcing.event_store ADD CONSTRAINT event_store_event_type_check CHECK ((event_type = ANY (ARRAY['CREATED_USER'::text, 'UPDATED_USER'::text, 'DELETED_USER'::text, 'LOGGED_USER_IN'::text, 'LOGGED_USER_OUT'::text, 'MATCH_REQUESTED'::text, 'MATCH_REJECTED'::text, 'MATCH_APPROVED'::text, 'MATCH_BLOCKED'::text])))`);
};
