import getProfile from '../queries/getProfile';
import createProfile from '../mutations/createProfile';
import updateProfile from '../mutations/updateProfile';

module.exports = {
  getProfile: getProfile,
  create: createProfile,
  update: updateProfile,
}