const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const keys = require('./config/keys');

// Load Models
require('./models/User');

require('./services/mongoose');

const app = express();

// Load Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/api/auth');
const dashboardRouter = require('./routes/api/dashboard');
const widgetRouter = require('./routes/api/widget');
const dashboardTemplateRouter = require('./routes/api/dashboardTemplate');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, keys.FRONTEND_PATH)));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'fj48f48dj38j34rFEF3Df4t',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);

// Use Routes
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/widget', widgetRouter);
app.use('/api/template', dashboardTemplateRouter);
app.use('*', indexRouter);




module.exports = app;
