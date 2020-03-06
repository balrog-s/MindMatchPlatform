import pg from '../../db';
import humps from 'humps';
import user from '../types/user';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql'

const userProperties = [
  'id',
  'first_name',
  'last_name',
  'username',
  'email',
  'created_at',
  'updated_at',
];

const getUser = (id, { isAuthenticated }) => {
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg('core.users')
    .first(userProperties)
    .where({
      id
    })
    .then(humps.camelizeKeys)
    .then(users => ({ error: false, payload: users }))
    .catch(err => ({ error: true, payload: err }));
};

module.exports = {
  type: new GraphQLObjectType({
    name: 'GetUser',
    fields: {
      error: {
        type: GraphQLBoolean
      },
      payload: {
        type: user.type
      }
    }
  }),
  args: {
    id: {
      type: GraphQLString
    }
  },
  resolve: (obj, { id }, ctx) => getUser(id, ctx)
}