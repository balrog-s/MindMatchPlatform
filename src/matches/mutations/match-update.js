import {
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString
} from 'graphql';
import match from '../types/match';
import pg from '../../db';
import humps from 'humps';
import uuidv4 from 'uuid/v4';

const matchUpdateInputType = new GraphQLInputObjectType({
  name: 'MatchUpdateInput',
  fields: {
    id: { type: GraphQLID },
    status: { type: GraphQLString }
  }
});

const insertMatchUpdatedEvent = ({ id, requestedUserId, status, streamId }, trx) => {
  const eventId = uuidv4();
  const event = `MATCH_${status}`;
  return pg('event_sourcing.event_store')
    .transacting(trx)
    .insert({
      id: eventId,
      event_type: event,
      payload: {
        matchId: id,
        requestedUserId
      },
      created_at: new Date(),
      created_by: requestedUserId,
      stream_id: streamId,
      stream_version: 1
    });
};

const updateMatchStatus = ({ id, status, userId }, trx) => {
  return pg('core.users_matches')
    .transacting(trx)
    .update({ status: status })
    .where({ id: id, requested_user_id: userId })
    .returning('*')
    .then(result => result[0])
    .then(humps.camelizeKeys)
};

const updateMatch = ({ id, status }, { isAuthenticated, user }) => {
  let matchState;
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg.transaction(trx => {
    return updateMatchStatus({
      id,
      userId: user.id,
      status
    }, trx)
      .then(result => matchState = result)
      .then(() => insertMatchUpdatedEvent({
        id,
        userId: user.id,
        status,
        streamId: matchState.id
      }, trx))
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .then(() => matchState)
    .catch(err => {
      console.log('ERROR', err);
      throw err;
    });
}

module.exports = {
  type: match.type,
  args: {
    input: { type: matchUpdateInputType }
  },
  resolve: (obj, { input }, ctx) => {
    return updateMatch(input, ctx);
  }
}