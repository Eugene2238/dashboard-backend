const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../../models/User');
require('../../models/Dashboard');
require('../../models/Widget');
const User = mongoose.model('User');
const Dashboard = mongoose.model('Dashboard');
const Widget = mongoose.model('Widget');
const Auth = require('../../services/auth');
const { normalizeErrors } = require('../../services/mongoose-helper');


router.get('/', Auth.authMiddleware, function(req, res, next) {
  Dashboard.find({ user: res.locals.user })
    .populate('widgets')
    .sort({ createdAt: 'desc' })
    .then(dashboards => {
      res.json(dashboards);
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
});

router.get('/:id', Auth.authMiddleware, function(req, res, next) {
  const user = res.locals.user;
  Dashboard.findOne({ _id: req.params.id, user: user }, function(err, dashboard) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    } else {
      res.json(dashboard);
    }
  }).populate('widgets');
});

router.delete('/:id', Auth.authMiddleware, function(req, res, next) {
  const user = res.locals.user;
  Dashboard.findOneAndDelete({ _id: req.params.id, user: user })
    .then(removedDashboard => {
      User.updateOne({ _id: user.id }, { $pullAll: { dashboards: [removedDashboard] } })
        .then(data => {
          Widget.remove({ dashboard: removedDashboard, user: user })
            .then(data => {
              res.json({ messages: [{ title: 'Success', detail: 'Dashboard is removed' }] });
            })
            .catch(err => {
              return res.status(422).send({ errors: normalizeErrors(err.errors) });
            });
        })
        .catch(err => {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        });
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
});

router.post('/', Auth.authMiddleware, function(req, res, next) {
  const user = res.locals.user;
  const dashboard = new Dashboard({
    title: req.body.title,
    description: req.body.description,
    user: user
  });

  User.updateOne({ _id: user.id }, { $push: { dashboards: dashboard } })
    .then(data => {
      dashboard
        .save()
        .then(dashboard => {
          res.json(dashboard);
        })
        .catch(err => {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        });
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
});

router.put('/:id', Auth.authMiddleware, function(req, res, next) {
  const user = res.locals.user;
  Dashboard.findOneAndUpdate(
    { _id: req.params.id, user: user },

    {
      $set: {
        title: req.body.title,
        description: req.body.description
      }
    },
    { new: true }
  )
    .then(dashboard => {
      res.json(dashboard);
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
});

module.exports = router;
