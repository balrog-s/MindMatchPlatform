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
      return user.create(args.input)
      .then(test => {
        console.log(test);
        return test;
      });
    }
  }
};

export default resolvers;