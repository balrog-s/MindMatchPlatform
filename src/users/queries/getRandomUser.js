import pg from '../../db';
import humps from 'humps';
import user from '../types/user';
import {
  GraphQLObjectType,
  GraphQLBoolean,
} from 'graphql'

const userProperties = [
  'id',
  'first_name',
  'last_name',
  'username',
];

const getRandomUser = (ctx) => {
  if (!ctx.isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg('core.users')
    .first(userProperties)
    .whereNot({
      id: ctx.user.id
    })
    .orderBy(pg.raw('random()'))
    .then(humps.camelizeKeys)
    .then(users => ({ error: false, payload: users }))
    .catch(err => ({ error: true, payload: err }));
};

module.exports = {
  type: new GraphQLObjectType({
    name: 'GetRandomUser',
    fields: {
      error: {
        type: GraphQLBoolean
      },
      payload: {
        type: user.type
      }
    }
  }),
  resolve: (obj, args, ctx) => getRandomUser(ctx)
}