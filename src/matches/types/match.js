import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const initiator = new GraphQLObjectType({
  name: "Initiator",
  fields: {
    id: {
      type: GraphQLID
    },
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    username: {
      type: GraphQLString
    }
  }
});

/**
* User type definition
**/
const type = new GraphQLObjectType({
  name: 'Match',
  fields: {
    id: {
      type: GraphQLID
    },
    initiator: {
      type: initiator
    },
    initiatorUserId: {
      type: GraphQLID
    },
    requestedUserId: {
      type: GraphQLID
    },
    status: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    },
  }
});




module.exports = {
  type,
}
