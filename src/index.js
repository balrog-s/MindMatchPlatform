import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
//AUTH
import { auth } from './authz/authToken';

import resolvers from './resolvers';
import typeDefs from './typeDefs';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(auth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    if (!req) {
      req = {};
    }
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
});
