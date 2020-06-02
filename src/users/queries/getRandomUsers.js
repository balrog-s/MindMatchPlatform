import pg from '../../db';
import humps from 'humps';
import user from '../types/user';
import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';

const userProperties = [
  'users.id',
  'first_name',
  'last_name',
  'username',
  'up.updated_at',
  'up.bio',
  'up.id as profile_id'
];

const getRandomUsers = (ctx) => {
  if (!ctx.isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg('core.users as users')
    .select(userProperties)
    .innerJoin('core.users_profile as up', 'up.user_id', 'users.id')
    .where(
      // this where clause ensures that users that have already requested are filtered out
      pg.raw(`
        users.id not in (select requested_user_id from core.users_matches as um where um.initiator_user_id = ?)
        and users.id not in (select initiator_user_id from core.users_matches as um where um.requested_user_id = ?)
        and users.id != ?
      `, [ctx.user.id, ctx.user.id, ctx.user.id])
    )
    .orderBy(pg.raw('random()'))
    .limit(6)
    .then(humps.camelizeKeys)
    .then(users => ({ error: false, payload: users }))
    .catch(err => ({ error: true, payload: err }));;
};

module.exports = {
  type: new GraphQLObjectType({
    name: 'GetRandomUsers',
    fields: {
      error: {
        type: GraphQLBoolean
      },
      payload: {
        type: new GraphQLList(user.type)
      }
    }
  }),
  resolve: (obj, args, ctx) => getRandomUsers(ctx)
}