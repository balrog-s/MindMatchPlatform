import pg from '../../db';
import humps from 'humps';
import uuidv4 from 'uuid/v4';

const MESSAGE_SENT = 'MESSAGE_SENT';

const insertMatchRequestedEvent = ({ chatId, payload, userId }, trx) => {
  const eventId = uuidv4();
  return pg('event_sourcing.event_store')
    .transacting(trx)
    .insert({
      id: eventId,
      event_type: MESSAGE_SENT,
      payload: {
        chatId,
        payload,
        createdBy: userId
      },
      created_at: new Date(),
      created_by: userId,
      stream_id: chatId,
      stream_version: 1
    });
};

const insertMessageResource = ({ chatId, payload, userId }, trx) => {
  const id = uuidv4();
  return pg('core.users_messages')
    .transacting(trx)
    .insert({
      id: id,
      chat_id: chatId,
      payload,
      created_by: userId
    })
    .returning('*')
    .then(result => result[0])
    .then(humps.camelizeKeys)
};

const sendMessages = ({ payload, chatId }, { isAuthenticated, user }) => {
  let messageState;
  const userId = user.id;
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg.transaction(trx => {
    return insertMessageResource({
      userId,
      chatId,
      payload,
    }, trx)
      .then(result => messageState = result)
      .then(() => insertMatchRequestedEvent({
        userId,
        chatId,
        payload
      }, trx))
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .then(() => ({error: false, payload: messageState}))
    .catch(err => {
      console.log('ERROR', err);
      throw err;
    });
}

module.exports = sendMessages;