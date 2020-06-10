import user from './users/models/user';
import match from './matches/models/match';
import profile from './profiles/models/profile';
import chat from './chats/models/chat';

import pubsub from './pubsub';

const resolvers = {
  Query: {
    users: (obj, _, ctx) => {
      return user.getUsers(ctx);
    },
    user: (obj, { id }, ctx) => {
      return user.getUser(id, ctx);
    },
    randomUsers: (obj, _, ctx) => {
      return user.getRandomUsers(ctx);
    },
    matches: (obj, _, ctx) => {
      return match.getMatches(ctx);
    },
    profile: (obj, args, ctx) => {
      return profile.getProfile(ctx, args);
    }
  },
  Mutation: {
    LoginUser: (obj, args, ctx) => {
      return user.login(args.input);
    },
    CreateUser: (obj, args, ctx) => {
      return user.create(args.input);
    },
    UpdateUser: (obj, args, ctx) => {
      return user.update(args.input);
    },
    CreateProfile: (obj, args, ctx) => {
      return profile.create(args.input, ctx);
    },
    UpdateProfile: (obj, args, ctx) => {
      return profile.update(args.input);
    },
    MatchRequest: (obj, args, ctx) => {
      return match.request(args.input, ctx);
    },
    UpdateMatch: (obj, args, ctx) => {
      return match.update(args.input, ctx);
    },
    StartChat: (obj, args, ctx) => {
      return chat.start(args.input, ctx);
    }
  }
};

export default resolvers;