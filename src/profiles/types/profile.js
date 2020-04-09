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
    user_id: {
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
