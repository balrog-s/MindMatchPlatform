import getUsers from '../queries/getUsers';
import getUser from '../queries/getUser';
import getRandomUsers from '../queries/getRandomUsers';
import loginUser from '../mutations/loginUser';
import createUser from '../mutations/createUser';
import updateUser from '../mutations/updateUser';

module.exports = {
  getUsers: getUsers,
  getUser: getUser,
  getRandomUsers: getRandomUsers,
  login: loginUser,
  create: createUser,
  update: updateUser,
}