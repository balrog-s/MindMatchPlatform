import pg from '../../db';
import humps from 'humps';
import hash from 'password-hash';
import uuidv4 from 'uuid/v4';

const UPDATED_USER = 'UPDATED_USER';

const insertUpdatedUserEvent = ({ id, firstName, lastName, username, password, email }, trx) => {
  const eventId = uuidv4();
  return pg('event_sourcing.event_store')
    .transacting(trx)
    .insert({
      id: eventId,
      event_type: UPDATED_USER,
      payload: {
        id,
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
        email: email,
      },
      created_at: new Date(),
      created_by: id,
      stream_id: id,
      stream_version: 1
    });
};

const updateUserResource = ({ id, firstName, lastName, username, hashedPassword, email }, trx) => {
  return pg('core.users')
    .transacting(trx)
    .update({
      first_name: firstName,
      last_name: lastName,
      username: username,
      password: hashedPassword,
      email: email,
    })
    .where({
      id,
    })
    .returning('*')
    .then(result => result[0])
    .then(humps.camelizeKeys)
};

const updateUser = ({ id, firstName, lastName, username, password, email }, { isAuthenticated }) => {
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  const hashedPassword = hash.generate(password);
  let userResource;
  return pg.transaction(trx => {
    return updateUserResource({
      id,
      firstName,
      lastName,
      username,
      hashedPassword,
      email,
    }, trx)
      .then(result => userResource = result)
      .then(() => insertUpdatedUserEvent({
        id,
        firstName,
        lastName,
        username,
        hashedPassword,
        email,
      }, trx))
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .then(() => userResource)
    .catch(err => {
      console.log('ERROR', err);
      throw err;
    });
}

module.exports = updateUser;