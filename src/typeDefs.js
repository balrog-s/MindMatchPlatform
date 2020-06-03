const typeDefs = `
type Query {
  users: UsersResponse,
  user: UserResponse,
  randomUsers: UsersResponse,
  matches: MatchesResponse,
  profile(userId: String): ProfileResponse,
}

type Mutation {
  LoginUser(username: String, password: String): LoginResponse,
  CreateUser(input: CreateUserParams): CreateUserResponse
}

type ProfileResponse {
  error: Boolean,
  payload: Profile
}

type Profile {
  id: String,
  userId: String,
  bio: String
}

type MatchesResponse {
  error: Boolean,
  payload: [Match]
}

type Match {
  id: String,
  initiator: Initiator,
  initiatorUserId: String,
  requestedUserId: String,
  status: String,
  createdAt: String,
  updatedAt: String
}

type Initiator {
  id: String,
  firstName: String,
  lastName: String,
  username: String
}

type UserResponse {
  error: Boolean,
  payload: [User]
}

type UsersResponse {
  error: Boolean,
  payload: [User]
}

type LoginResponse {
  error: Boolean,
  payload: LoginPayload
}

type LoginPayload {
  token: String,
  user: String
}

input CreateUserParams {
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String
}

type CreateUserResponse {
  error: Boolean,
  payload: User
}

type User {
  id: String,
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  createdAt: String,
  updatedAt: String,
  bio: String,
  profileId: String
}

schema {
  query: Query
  mutation: Mutation
}
`;

export default typeDefs;