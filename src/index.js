import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const { ApolloServer } = require('apollo-server-express');

import {
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";

//USER MUTATIONS
import createUser from './users/mutations/create-user';
import updateUser from './users/mutations/update-user';
import loginUser from './users/mutations/login-user';
import userCreatedSubscription from './users/subscriptions/user-created';

//USER QUERIES
import getUsers from './users/queries/getUsers';
import getUser from './users/queries/getUser';
import getRandomUsers from './users/queries/getRandomUsers';

//MATCH MUTATIONS
import matchRequest from './matches/mutations/match-request';
import matchUpdate from './matches/mutations/match-update';

//MATCH QUERIES
import getMatches from './matches/queries/getMatches';

//PROFILE MUTATIONS
import createProfile from './profiles/mutations/create-profile';
import updateProfile from './profiles/mutations/update-profile';

//PROFILE QUERIES
import getProfile from './profiles/queries/getProfile';

//AUTH
import { auth } from './authz/authToken';

import resolvers from './resolvers';
import typeDefs from './typeDefs';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(auth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req, res}) => {
    return { user: req.user || null, isAuthenticated: req.isAuthenticated }
  },
  subscriptions: {
    onConnect: () => console.log('Connected to websocket'),
  }
});

server.applyMiddleware({ app })

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})

// app.get("/", function (req, res) {
//   res.send("Welcome to my API: Version 1.0.0");
// });

// app.use(bodyParser.json());
// app.use(auth);

// const schema = new GraphQLSchema({
//   subscription: new GraphQLObjectType({
//     name: "RootSubscriptionType",
//     fields: {
//       UserCreated: userCreatedSubscription,
//     }
//   }),
//   query: new GraphQLObjectType({
//     name: "RootQueryType",
//     fields: {
//       users: getUsers,
//       user: getUser,
//       randomUsers: getRandomUsers,
//       matches: getMatches,
//       profile: getProfile
//     }
//   }),
//   mutation: new GraphQLObjectType({
//     name: "RootMutationType",
//     fields: () => ({
//       CreateUser: createUser,
//       UpdateUser: updateUser,
//       LoginUser: loginUser,
//       MatchRequest: matchRequest,
//       MatchUpdate: matchUpdate,
//       CreateProfile: createProfile,
//       UpdateProfile: updateProfile
//     })
//   })
// });

// const server = new ApolloServer({
//   schema,
//   context: ({req, res}) => ({ user: req.user, isAuthenticated: req.isAuthenticated })
// });

// server.applyMiddleware({
//   app, // app is from an existing express app
// });

// app.listen(port, () => {
//   console.log(`LISTENING ON ${port}`);
//   console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`)
// });