import user from './users/models/user';
import match from './matches/models/match';
import profile from './profiles/models/profile';

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
    LoginUser: (obj, input, ctx) => {
      return user.login(input);
    },
    CreateUser: (obj, args, ctx) => {
      return user.create(args.input);
    },
    UpdateUser: (obj, args, ctx) => {
      return user.update(args.input);
    },
    CreateProfile: (obj, args, ctx) => {
      return profile.create(args);
    },
    UpdateProfile: (obj, args, ctx) => {
      return profile.update(args);
    },
    MatchRequest: (obj, args, ctx) => {
      return match.request(args, ctx);
    },
    UpdateMatch: (pbj, args, ctx) => {
      return match.update(args, ctx);
    }
  }
};

export default resolvers;