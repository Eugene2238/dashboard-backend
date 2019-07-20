const mongoose = require('mongoose');
const jwt = require('jwt-simple');

const keys = require('../config/keys');
const User = mongoose.model('User');

exports.authMiddleware = function(req, res, next) {
  const token = req.headers.authorization || '';

  if (token) {
    const user = parseToken(token);
    console.log(user);

    User.findOne({ _id: user.userId }, function(err, user) {
      if (err) return res.status(422).send({ errors: [{ title: 'Server error', detail: 'Something went wrong' }] });

      if (user) {
        res.locals.user = user;
        next();
      } else {
        return res.status(422).send({ errors: [{ title: 'Not Authorized', detail: 'You are not authorized' }] });
      }
    });
  } else {
    return res.status(422).send({ errors: [{ title: 'Not Authorized', detail: 'You are not authorized' }] });
  }
};

function parseToken(token) {
  if (token.includes('Bearer')) {
    return jwt.decode(token.split(' ')[1], keys.SECRET);
  }

  return token;
}


module.exports.getUserFromToken = function(data) {
  if (data.token) {
    const user = parseToken(data.token);
    return user.userId;
  } else {
    return false;
  }
};
