import getMatches from '../queries/getMatches';
import matchRequest from '../mutations/matchRequest';
import updateMatch from '../mutations/updateMatch';

module.exports = {
  getMatches: getMatches,
  request: matchRequest,
  update: updateMatch,
}