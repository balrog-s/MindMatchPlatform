import pg from '../../db';
import humps from 'humps';

const userProperties = [
  'id',
  'first_name',
  'last_name',
  'username',
  'email',
  'created_at',
  'updated_at',
];

const getUser = (id) => {
  // if (!isAuthenticated) {
  //   throw new Error(`User is not authenticated`);
  // }
  return pg('core.users')
    .first(userProperties)
    .where({
      id
    })
    .then(humps.camelizeKeys)
    .then(users => ({ error: false, payload: users }))
    .catch(err => ({ error: true, payload: err }));
};

module.exports = getUser;