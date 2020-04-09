import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

/**
* User type definition
**/
const type = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: {
      type: GraphQLID
    },
    userId: {
      type: GraphQLID
    },
    bio: {
      type: GraphQLString
    }
  }
});




module.exports = {
  type,
}
