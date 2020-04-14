let uuidv4 = require('uuid/v4');
let Promise = require('bluebird');
let hash = require('password-hash');

const generateString = () => Math.random().toString(36).substring(7);
const generatePassword = () => hash.generate('password');

const createUser = () => {
  return {
    id: uuidv4(),
    username: generateString(),
    first_name: generateString(),
    last_name: generateString(),
    email: `${generateString()}@live.com`,
    password: generatePassword(),
    created_at: new Date(),
    updated_at: new Date()
  }
}

const createEvent = user => {
  const eventId = uuidv4();
  return {
    id: eventId,
    event_type: 'CREATED_USER',
    payload: {
      user
    },
    created_at: new Date(),
    created_by: user.id,
    stream_id: user.id,
    stream_version: 1
  };
};

const insertUserAndEvent = user => (knex, trx) => {
  return knex('core.users')
    .transacting(trx)
    .insert(user)
    .returning('*')
    .then(resp => resp[0])
    .then(user => {
      return knex('event_sourcing.event_store')
      .transacting(trx)
      .insert(createEvent(user))
    })
};

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.transaction(trx => {
    let numOfUsers = 30;
    const adminUser = {
      id: uuidv4(),
      username: 'admin',
      first_name: 'Admin',
      last_name: 'user',
      email: `admin@live.com`,
      password: generatePassword(),
      created_at: new Date(),
      updated_at: new Date()
    }
    let p = [];
    p.push(insertUserAndEvent(adminUser)(knex, trx));
    for (let i = 0; i < numOfUsers; i++) {
      const user = createUser();
      p.push(insertUserAndEvent(user)(knex, trx))
    }
    return Promise.all(p)
      .catch(trx.rollback)
      .then(trx.commit);
  });
};
