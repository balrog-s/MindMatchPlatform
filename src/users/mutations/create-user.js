import {
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql';
import user from '../types/user';
import pg from '../../db';
import humps from 'humps';
import hash from 'password-hash';
import uuidv4 from 'uuid/v4';


const CREATED_USER = 'CREATED_USER';

const createUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
  }
});

const insertCreatedUserEvent = ({ id, firstName, lastName, username, hashedPassword, email }, trx) => {
  const eventId = uuidv4();
  return pg('event_sourcing.event_store')
    .transacting(trx)
    .insert({
      id: eventId,
      event_type: CREATED_USER,
      payload: {
        id,
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: hashedPassword,
        email: email
      },
      created_at: new Date(),
      created_by: id,
      stream_id: id,
      stream_version: 1
    });
}

const insertUserResource = ({ id, firstName, lastName, username, hashedPassword, email }, trx) => {
  return pg('core.users')
    .transacting(trx)
    .insert({
      id: id,
      first_name: firstName,
      last_name: lastName,
      username: username,
      password: hashedPassword,
      email: email,
    })
    .returning('*')
    .then(result => result[0])
    .then(humps.camelizeKeys)
};

const createUser = ({ firstName, lastName, username, password, email }) => {
  const id = uuidv4();
  const hashedPassword = hash.generate(password);
  let userResource;
  return pg.transaction(trx => {
    return insertUserResource({
      id,
      firstName,
      lastName,
      username,
      hashedPassword,
      email
    }, trx)
      .then(result => userResource = result)
      .then(() => insertCreatedUserEvent({
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

module.exports = {
  type: user.type,
  args: {
    input: { type: createUserInputType }
  },
  resolve: (obj, { input }, ctx) => {
    return createUser(input);
  }
}
