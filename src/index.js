import express from 'express';
import graphqlHTTP from "express-graphql";
import bodyParser from 'body-parser';
import cors from 'cors';

import {
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";

//USER MUTATIONS
import createUser from './users/mutations/create-user';
import updateUser from './users/mutations/update-user';
import loginUser from './users/mutations/login-user';

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

const app = express();
const port = process.env.PORT || 3000;

app.get("/", function (req, res) {
  res.send("Welcome to my API: Version 1.0.0");
});

app.use(bodyParser.json());
app.use(auth);

app.use("/graphql", cors(), graphqlHTTP(req => ({
  context: { user: req.user, isAuthenticated: req.isAuthenticated },
  schema: new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "RootQueryType",
      fields: {
        users: getUsers,
        user: getUser,
        randomUsers: getRandomUsers,
        matches: getMatches,
        profile: getProfile
      }
    }),
    mutation: new GraphQLObjectType({
      name: "RootMutationType",
      fields: () => ({
        CreateUser: createUser,
        UpdateUser: updateUser,
        LoginUser: loginUser,
        MatchRequest: matchRequest,
        MatchUpdate: matchUpdate,
        CreateProfile: createProfile,
        UpdateProfile: updateProfile
      })
    })
  }),
  graphiql: true
})));

app.listen(port, () => {
  console.log(`LISTENING ON ${port}`);
});