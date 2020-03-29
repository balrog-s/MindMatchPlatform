import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

/**
* User type definition
**/
const type = new GraphQLObjectType({
  name: 'Match',
  fields: {
    id: {
      type: GraphQLID
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
