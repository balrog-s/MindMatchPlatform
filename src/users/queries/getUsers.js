import pg from '../../db';
import humps from 'humps';
import user from '../types/user';
import {
  GraphQLObjectType,
  GraphQLList,
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

const getUsers = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg('core.users')
    .select(userProperties)
    .then(humps.camelizeKeys)
    .then(users => ({ error: false, payload: users }))
    .catch(err => ({ error: true, payload: err }));
};

module.exports = {
  type: new GraphQLObjectType({
    name: 'GetUsers',
    fields: {
      error: {
        type: GraphQLBoolean
      },
      payload: {
        type: new GraphQLList(user.type)
      }
    }
  }),
  resolve: (obj, { input }, ctx) => getUsers(ctx)
}