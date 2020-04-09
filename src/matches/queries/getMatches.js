import pg from '../../db';
import humps from 'humps';
import match from '../types/match';
import Promise from 'bluebird';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';

const matchProperties = [
  'core.users_matches.id',
  'core.users.username as initiator_username',
  'core.users.first_name as initiator_first_name',
  'core.users.last_name as initiator_last_name',
  'initiator_user_id',
  'requested_user_id',
  'status',
  'core.users_matches.created_at',
  'core.users_matches.updated_at'
];

const getMatches = ({ isAuthenticated, user }) => {
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg('core.users_matches')
    .select(matchProperties)
    .innerJoin('core.users', 'core.users_matches.initiator_user_id', 'core.users.id')
    .where({ requested_user_id: user.id })
    .then(matches =>
      matches.map(
        match => ({
          id: match.id,
          requested_user_id: match.requested_user_id,
          status: match.status,
          created_at: match.created_at,
          updated_at: match.updated_at,
          initiator: {
            id: match.initiator_user_id,
            first_name: match.initiator_first_name,
            last_name: match.initiator_last_name,
            username: match.initiator_username
          }
        })
      )
    )
    .then(humps.camelizeKeys)
    .then(matches => ({ error: false, payload: matches }))
    .catch(err => {
      console.log(err);
      return ({ error: true, payload: err })
    });
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