import pg from '../../db';
import humps from 'humps';
import uuidv4 from 'uuid/v4';

const CHAT_STARTED = 'CHAT_STARTED';

const insertStartChatEvent = ({ matchId, userId, streamId }, trx) => {
  const eventId = uuidv4();
  return pg('event_sourcing.event_store')
    .transacting(trx)
    .insert({
      id: eventId,
      event_type: CHAT_STARTED,
      payload: {
        matchId
      },
      created_at: new Date(),
      created_by: userId,
      stream_id: streamId,
      stream_version: 1
    });
};

const insertChatResource = ({ matchId, userId }, trx) => {
  const id = uuidv4();
  return pg('core.users_chats')
    .transacting(trx)
    .insert({
      id: id,
      matchId: matchId,
      status: 'ACTIVE',
      createdBy: userId
    })
    .returning('*')
    .then(result => result[0])
    .then(humps.camelizeKeys)
};

const startChat = ({ matchId }, { isAuthenticated, user }) => {
  let chatState;
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg.transaction(trx => {
    return insertChatResource({
      matchId,
      userId: user.id
    }, trx)
      .then(result => chatState = result)
      .then(() => insertStartChatEvent({
        matchId,
        userId: user.id,
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

module.exports = startChat;