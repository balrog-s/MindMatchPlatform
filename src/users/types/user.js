import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

/**
* User type definition
**/
const type = new GraphQLObjectType({
  name: 'User',
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
    },
    email: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    },
    bio: {
      type: GraphQLString
    },
    profileId: {
      type: GraphQLID
    }
  }
});




module.exports = {
  type,
}
