import pg from '../../db';
import humps from 'humps';
import profile from '../types/profile';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';

const matchProperties = [
  'core.users.id',
  'core.users.username',
  'core.users.first_name',
  'core.users.last_name',
  'core.users.email',
  'core.users_profile.id',
  'core.users_profile.bio'
];

const getMatches = ({ isAuthenticated }, {userId}) => {
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg('core.users_profile')
    .first(matchProperties)
    .innerJoin('core.users', 'core.users_profile.user_id', 'core.users.id')
    .where({ 'core.users.id': userId })
    .then(humps.camelizeKeys)
    .then(profile => ({ error: false, payload: profile }))
    .catch(err => {
      console.log(err);
      return ({ error: true, payload: err })
    });
};

module.exports = {
  type: new GraphQLObjectType({
    name: 'GetProfile',
    fields: {
      error: {
        type: GraphQLBoolean
      },
      payload: {
        type: new GraphQLList(profile.type)
      }
    }
  }),
  resolve: (obj, { input }, ctx) => getMatches(ctx, {userId: input.id})
}