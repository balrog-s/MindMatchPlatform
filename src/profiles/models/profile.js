import getProfile from '../queries/getProfile';
import createProfile from '../mutations/create-profile';
import updateProfile from '../mutations/update-profile';

module.exports = {
  getProfile: getProfile,
  create: createProfile,
  update: updateProfile,
}