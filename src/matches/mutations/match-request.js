import {
  GraphQLInputObjectType,
  GraphQLID,
} from 'graphql';
import match from '../types/match';
import pg from '../../db';
import humps from 'humps';
import uuidv4 from 'uuid/v4';

const MATCH_REQUESTED = 'MATCH_REQUESTED';

const matchRequestInputType = new GraphQLInputObjectType({
  name: 'MatchRequestInput',
  fields: {
    initiatorUserId: { type: GraphQLID },
    requestedUserId: { type: GraphQLID },
  }
});

const insertMatchRequestedEvent = ({ initiatorUserId, requestedUserId, streamId }, trx) => {
  const eventId = uuidv4();
  return pg('event_sourcing.event_store')
    .transacting(trx)
    .insert({
      id: eventId,
      event_type: MATCH_REQUESTED,
      payload: {
        initiatorUserId,
        requestedUserId
      },
      created_at: new Date(),
      created_by: initiatorUserId,
      stream_id: streamId,
      stream_version: 1
    });
};

const insertMatchRequestedResource = ({ initiatorUserId, requestedUserId }, trx) => {
  const id = uuidv4();
  return pg('core.users_matches')
    .transacting(trx)
    .insert({
      id: id,
      initiator_user_id: initiatorUserId,
      requested_user_id: requestedUserId,
      status: 'PENDING'
    })
    .returning('*')
    .then(result => result[0])
    .then(humps.camelizeKeys)
};

const requestMatch = ({ initiatorUserId, requestedUserId }, { isAuthenticated }) => {
  let matchState;
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg.transaction(trx => {
    return insertMatchRequestedResource({
      initiatorUserId,
      requestedUserId
    }, trx)
      .then(result => matchState = result)
      .then(() => insertMatchRequestedEvent({
        initiatorUserId,
        requestedUserId,
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
    input: { type: matchRequestInputType }
  },
  resolve: (obj, { input }, ctx) => {
    return requestMatch(input, ctx);
  }
}