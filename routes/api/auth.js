const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jwt-simple');

require('../../models/User');
const keys = require('../../config/keys');
const User = mongoose.model('User');
const { normalizeErrors } = require('../../services/mongoose-helper');

router.post('/register', function(req, res, next) {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const passwordConf = req.body.passwordConfirmation;

  if (password !== passwordConf) {
    return res
      .status(422)
      .send({ errors: [{ title: 'Invalid Password', detail: 'Password is not same as confirmation' }] });
  }

  User.findOne({ email: email })
    .then(existingUser => {
      if (existingUser) {
        return res.status(422).send({ errors: [{ title: 'Invalid Email', detail: 'Email is in use' }] });
      }
      const user = new User({
        name: name,
        email: email,
        password: password
      });

      user
        .save()
        .then(newUser => {
          // return res.json({ registered: true });
          res.json(newUser);
        })
        .catch(err => {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        });
    })
    .catch(err => {
      // this will eventually be handled by your error handling middleware in case of next()
      return res.status(422).send({ errors: [{ title: 'Server error', detail: 'Something went wrong' }] });
    });
});

router.post('/login', function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password)
    return res.status(422).send({ errors: [{ title: 'Missing Data', detail: 'Provide email and password' }] });

  User.findOne({ email: email }, function(err, user) {
    if (err) return res.status(422).send({ errors: [{ title: 'Server error', detail: 'Something went wrong' }] });
    if (!user) return res.status(422).send({ errors: [{ title: 'Invalid User', detail: 'Wrong email or password' }] });

    if (user.isSamePassword(password)) {
      return res.json({
        token: jwt.encode({ userId: user.id, email: user.email, name: user.name }, keys.SECRET),
        email: user.email
      });
    } else {
      return res.status(422).send({ errors: [{ title: 'Wrong Data', detail: 'Wrong email or password' }] });
    }
  });
});

module.exports = router;
