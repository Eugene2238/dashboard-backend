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

router.get('/:id', Auth.authMiddleware, function(req, res, next) {
  const user = res.locals.user;
  Widget.findOne({ _id: req.params.id, user: user }, function(err, widget) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    } else {
      res.json(widget);
    }
  });
});

router.delete('/:id', Auth.authMiddleware, function(req, res, next) {
  const user = res.locals.user;
  Widget.findOneAndDelete({ _id: req.params.id, user: user })
    .then(removedWidget => {
      Dashboard.updateOne({ user: user, _id: removedWidget.dashboard }, { $pullAll: { widgets: [removedWidget] } })
        .then(data => {
          res.json({ messages: [{ title: 'Success', detail: 'Widget is removed' }] });
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
  Dashboard.findOne({ _id: req.body.dashboard._id, user: user }, function(err, dashboard) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    } else {
      const widget = new Widget({
        settings: req.body.settings,
        template: req.body.template,
        dashboard: dashboard,
        user: user,
        result: {
          date: new Date(),
          status: 0
        }
      });
      widget
        .save()
        .then(newWidget => {
          Dashboard.updateOne({ _id: dashboard._id }, { $push: { widgets: widget } })
            .then(data => {
              res.json(widget);
            })
            .catch(err => {
              return res.status(422).send({ errors: normalizeErrors(err.errors) });
            });
        })
        .catch(err => {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        });
    }
  });
});

router.put('/:id', Auth.authMiddleware, function(req, res, next) {
  const user = res.locals.user;
  Widget.findOneAndUpdate(
    { _id: req.params.id, user: user },

    {
      $set: {
        settings: req.body.settings
      }
    },
    { new: true }
  )
    .then(widget => {
      res.json(widget);
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
});

module.exports = router;
