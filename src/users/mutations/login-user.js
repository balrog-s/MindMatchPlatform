import jwt from 'jsonwebtoken';
import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean
} from 'graphql';
import pg from '../../db';
import humps from 'humps';
import hash from 'password-hash';
import uuidv4 from 'uuid/v4';
import R from 'ramda';
import Promise from 'bluebird';

const LOGGED_USER_IN = 'LOGGED_USER_IN';

const loginUserInputType = new GraphQLInputObjectType({
  name: 'LoginUserInput',
  fields: {
    username: { type: GraphQLString },
    password: { type: GraphQLString }
  }
});

/**
 * This function is responsible for logging a login attempt by the specified user.
 * @param {username}
 * @return {eventId} The event stored for this login attempt.
 */
const insertLoggedUserInEvent = ({ user, payload }) => {
  const eventId = uuidv4();
  const { password, ...userData } = user;

  return pg('event_sourcing.event_store')
    .insert({
      id: eventId,
      event_type: LOGGED_USER_IN,
      payload: {
        ...userData,
        token: payload.token
      },
      created_at: new Date(),
      created_by: userData.id,
      stream_id: userData.id,
      stream_version: 1
    }).then(() => payload);
};

const findUserByUsername = ({ username }) =>
  pg('core.users')
  .first(['id', 'email', 'username', 'password', 'first_name', 'last_name'])
  .where({ username })
  .then(humps.camelizeKeys);

/**
 * This function is the controller for logging the user in.
 * @param {username, password}  An object that contains the username and password a user provided. 
 * @return {token} A JWT returned to the user.
*/
const loginUser = ({ username, password }) => {
  return findUserByUsername({ username })
    .then(user => {
      if (R.isEmpty(user) || R.isNil(user)) {
        return {
          error: true,
          user,
          payload: 'User not found'
        };
      };
      return { user };
    })
    .then(({ error, payload, user }) => {
      if (error) {
        return {
          error: true,
          payload: payload
        }
      } else {
        return verifyPassword({ providedPassword: password, user })
          .then(payload => insertLoggedUserInEvent({ user, payload }))
      }
    })
};

/**
 * This function is responsible for verifying that the provided username exists and that the password provided is correct.
 * @param {username, password} An object that contains the username and password a user provided.
 * @return {passwordVerified, user} An object containing a boolean value for if the password is correct and the user object.
*/
const verifyPassword = ({ providedPassword, user }) => {
  return Promise.try(() => {
    const passwordVerified = hash.verify(providedPassword, user.password);
    if (!passwordVerified) {
      return {
        error: true,
        payload: 'Password Incorrect'
      }
    }
    return {
      error: false,
      payload: {
        token: jwt.sign(user, 'secretkey', { expiresIn: '1d' }),
        user: JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        })
      }
    };
  });
};

module.exports = {
  type: new GraphQLObjectType({
    name: 'LoginUser',
    fields: {
      error: {
        type: GraphQLBoolean
      },
      payload: {
        type: new GraphQLObjectType({
          name: 'LoginPayload',
          fields: {
            token: {
              type: GraphQLString
            },
            user: {
              type: GraphQLString
            }
          }
        })
      }
    }
  }),
  args: {
    input: { type: loginUserInputType }
  },
  resolve: (obj, { input }, ctx) => {
    return loginUser(input);
  }
}
