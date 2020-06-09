import pg from '../../db';
import humps from 'humps';
import uuidv4 from 'uuid/v4';


const CREATED_PROFILE = 'CREATED_PROFILE';

const insertCreatedProfileEvent = ({ profileId, userId, bio, streamId }, trx) => {
  const eventId = uuidv4();
  return pg('event_sourcing.event_store')
    .transacting(trx)
    .insert({
      id: eventId,
      event_type: CREATED_PROFILE,
      payload: {
        id: profileId,
        user_id: userId,
        bio,
      },
      created_at: new Date(),
      created_by: userId,
      stream_id: streamId,
      stream_version: 1
    });
}

const insertProfile = ({ userId, bio }, trx) => {
  const id = uuidv4();
  return pg('core.users_profile')
    .transacting(trx)
    .insert({
      id,
      bio,
      user_id: userId
    })
    .returning('*')
    .then(result => result[0])
    .then(humps.camelizeKeys)
};

const createProfile = ({ bio }, { user, isAuthenticated }) => {
  const userId = user.id;
  let profile;
  if (!isAuthenticated) {
    throw new Error(`User is not authenticated`);
  }
  return pg.transaction(trx => {
    return insertProfile({
      userId,
      bio
    }, trx)
      .then(result => profile = result)
      .then(() => insertCreatedProfileEvent({
        profileId: profile.id,
        userId,
        bio,
        streamId: profile.id
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

module.exports = createProfile;
