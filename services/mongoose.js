const mongoose = require('mongoose');

// Load Keys
const keys = require('../config/keys');

// Map global promises
mongoose.Promise = global.Promise;

// https://github.com/Automattic/mongoose/issues/6890
mongoose.set('useCreateIndex', true);

// Mongoose Connect
mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
