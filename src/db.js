var knex = require('knex');

let connection;

if (process.env.NODE_ENV === 'production') {
  connection = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL
  });
} else {
  connection = knex({
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '1234',
      database: 'mindmatch_platform',
    },
  });
}

module.exports = connection;