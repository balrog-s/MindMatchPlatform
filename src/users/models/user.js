import getUsers from '../queries/getUsers';
import getUser from '../queries/getUser';
import getRandomUsers from '../queries/getRandomUsers';
import loginUser from '../mutations/login-user';
import createUser from '../mutations/create-user';
import updateUser from '../mutations/update-user';

module.exports = {
  getUsers: getUsers,
  getUser: getUser,
  getRandomUsers: getRandomUsers,
  login: loginUser,
  create: createUser,
  update: updateUser,
}