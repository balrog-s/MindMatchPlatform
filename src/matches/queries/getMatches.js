import pg from '../../db';
import humps from 'humps';
import match from '../types/match';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';

const matchProperties = [
  'id',
  'initiator_user_id',
  'requested_user_id',
  'status',
  'created_at',
  'updated_at'
];

const getMatches = ({ isAuthenticated, user }) => {
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg('core.users_matches')
    .select(matchProperties)
    .where({ requested_user_id: user.id })
    .then(humps.camelizeKeys)
    .then(matches => ({ error: false, payload: matches }))
    .catch(err => ({ error: true, payload: err }));
};

module.exports = {
  type: new GraphQLObjectType({
    name: 'GetMatches',
    fields: {
      error: {
        type: GraphQLBoolean
      },
      payload: {
        type: new GraphQLList(match.type)
      }
    }
  }),
  resolve: (obj, { input }, ctx) => getMatches(ctx)
}