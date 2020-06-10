const typeDefs = `
type Query {
  users: UsersResponse,
  user: UserResponse,
  randomUsers: UsersResponse,
  matches: MatchesResponse,
  profile(userId: String): ProfileResponse,
}

type Mutation {
  LoginUser(input: LoginUserParams): LoginResponse,
  CreateUser(input: CreateUserParams): CreateUserResponse,
  UpdateUser(input: UpdateUserParams): UpdateUserResponse,
  CreateProfile(input: CreateProfileParams): CreateProfileResponse,
  UpdateProfile(input: UpdateProfileParams): UpdateProfileResponse,
  MatchRequest(input: MatchRequestParams): MatchRequestResponse,
  UpdateMatch(input: UpdateMatchParams): UpdateMatchResponse,
  StartChat(input: StartChatParams): StartChatResponse,
}

input LoginUserParams {
  username: String,
  password: String
}

input StartChatParams {
  matchId: String
}

type StartChatResponse {
  error: Boolean,
  payload: Chat
}

input UpdateMatchParams {
  id: String,
  status: String,
}

type UpdateMatchResponse {
  error: Boolean,
  payload: Match
}

input MatchRequestParams {
  initiatorUserId: String,
  requestedUserId: String
}

type MatchRequestResponse {
  error: Boolean,
  payload: Match
}

input UpdateProfileParams {
  id: String,
  userId: String,
  bio: String
}

type UpdateProfileResponse {
  error: Boolean,
  payload: Profile
}

input CreateProfileParams {
  userId: String,
  bio: String
}

type CreateProfileResponse {
  error: Boolean,
  payload: Profile
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

type Chat {
  id: String,
  status: String,
  matchId: String,
  createdAt: String,
  updatedAt: String
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

input UpdateUserParams {
  id: String,
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String
}

type UpdateUserResponse {
  error: Boolean,
  payload: User
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