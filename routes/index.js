const express = require('express');
const router = express.Router();
const path = require('path');
const keys = require('../config/keys');

router.get('*', function(req, res, next) {
    res.sendFile(path.resolve(keys.FRONTEND_PATH + '/index.html'));
});

module.exports = router;
