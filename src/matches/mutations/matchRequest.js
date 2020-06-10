import pg from '../../db';
import humps from 'humps';
import uuidv4 from 'uuid/v4';

const MATCH_REQUESTED = 'MATCH_REQUESTED';

const insertMatchRequestedEvent = ({ requestedUserId, userId, streamId }, trx) => {
  const eventId = uuidv4();
  return pg('event_sourcing.event_store')
    .transacting(trx)
    .insert({
      id: eventId,
      event_type: MATCH_REQUESTED,
      payload: {
        initiatorUserId: userId,
        requestedUserId
      },
      created_at: new Date(),
      created_by: userId,
      stream_id: streamId,
      stream_version: 1
    });
};

const insertMatchRequestedResource = ({ requestedUserId, userId }, trx) => {
  const id = uuidv4();
  return pg('core.users_matches')
    .transacting(trx)
    .insert({
      id: id,
      initiator_user_id: userId,
      requested_user_id: requestedUserId,
      status: 'PENDING'
    })
    .returning('*')
    .then(result => result[0])
    .then(humps.camelizeKeys)
};

const requestMatch = ({ requestedUserId }, { isAuthenticated, user }) => {
  let matchState;
  const userId = user.id;
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg.transaction(trx => {
    return insertMatchRequestedResource({
      userId,
      requestedUserId
    }, trx)
      .then(result => matchState = result)
      .then(() => insertMatchRequestedEvent({
        userId,
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

module.exports = requestMatch;