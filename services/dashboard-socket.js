const mongoose = require('mongoose');

require('../models/Dashboard');
const Dashboard = mongoose.model('Dashboard');
const { getUserFromToken } = require('./auth');
const { normalizeErrors } = require('../services/mongoose-helper');

module.exports = function(io) {
  const connectionDetail = [];

  io.on('connection', socket => {
    connectionDetail[socket.id] = {
      userId: null,
      dashboardId: null
    };

    socket.on('dashboard', function(data) {
      connectionDetail[socket.id].userId = getUserFromToken(data);
      connectionDetail[socket.id].dashboardId = data.id;
      Dashboard.findOne({ _id: connectionDetail[socket.id].dashboardId, user: connectionDetail[socket.id].userId }, function(err, dashboard) {
        if (err) {
          // socket.emit('dashboard',  { errors: normalizeErrors(err.errors) });
        } else {
          socket.emit('dashboard', dashboard);
        }
      }).populate('widgets');

    });

    setInterval(function() {
      if (connectionDetail[socket.id].userId && connectionDetail[socket.id].dashboardId) {
        Dashboard.findOne({ _id: connectionDetail[socket.id].dashboardId, user: connectionDetail[socket.id].userId }, function(err, dashboard) {
          if (err) {
            // socket.emit('dashboard',  { errors: normalizeErrors(err.errors) });
          } else {
            socket.emit('dashboard', dashboard);
          }
        }).populate('widgets');
      }
    }, 3000);

  });

};
