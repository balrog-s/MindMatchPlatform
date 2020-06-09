import pg from '../../db';
import humps from 'humps';
import uuidv4 from 'uuid/v4';


const UPDATED_PROFILE = 'UPDATED_PROFILE';

const insertUpdatedProfileEvent = ({ id, userId, bio, streamId }, trx) => {
  const eventId = uuidv4();
  return pg('event_sourcing.event_store')
    .transacting(trx)
    .insert({
      id: eventId,
      event_type: UPDATED_PROFILE,
      payload: {
        id,
        user_id: userId,
        bio,
      },
      created_at: new Date(),
      created_by: userId,
      stream_id: streamId,
      stream_version: 1
    });
}

const updateProfileResource = ({ id, bio, userId }, trx) => {
  return pg('core.users_profile')
    .transacting(trx)
    .update({
      id,
      bio,
      user_id: userId
    })
    .returning('*')
    .then(result => result[0])
    .then(humps.camelizeKeys)
};

const updateProfile = ({ id, userId, bio }) => {
  let profile;
  return pg.transaction(trx => {
    return updateProfileResource({
      id,
      userId,
      bio
    }, trx)
      .then(result => profile = result)
      .then(() => insertUpdatedProfileEvent({
        id,
        userId,
        bio,
        streamId: id
      }, trx))
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .then(() => profile)
    .catch(err => {
      console.log('ERROR', err);
      throw err;
    });
}

module.exports = updateProfile;
