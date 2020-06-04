import getMatches from '../queries/getMatches';
import matchRequest from '../mutations/match-request';
import updateMatch from '../mutations/update-match';

module.exports = {
  getMatches: getMatches,
  request: matchRequest,
  update: updateMatch,
}