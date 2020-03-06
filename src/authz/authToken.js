import jwt from 'jsonwebtoken';
import R from 'ramda';

const auth = (req, res, next) => {
  if (R.isEmpty(req.headers['authorization']) || R.isNil(req.headers['authorization'])) {
    req.isAuthenticated = false;
    return next();
  }
  const authorization = req.headers['authorization'];
  const token = authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'secretkey');
  req.user = decodedToken;
  req.isAuthenticated = true;
  return next();
};

module.exports = { auth };
