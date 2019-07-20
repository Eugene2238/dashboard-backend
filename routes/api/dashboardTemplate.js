const express = require('express');
const router = express.Router();

const Auth = require('../../services/auth');

router.get('/', Auth.authMiddleware, function(req, res, next) {
  const categories = [
    {
      name: 'Application monitoring',
      templates: [
        {
          name: 'SSL Certificate Monitoring',
          sysName: 'ssl-certificate'
        },
        {
          name: 'Domain Health Monitoring',
          sysName: 'domain-health'
        },
        {
          name: 'Website Security Monitoring',
          sysName: 'web-security'
        },
        {
          name: 'Checking if a Page Contains Specific Text',
          sysName: 'specific-text'
        }
      ]
    },
    {
      name: 'Server monitoring',
      templates: []
    },
    {
      name: 'Cloud monitoring',
      templates: []
    },
    {
      name: 'Network monitoring',
      templates: []
    },
    {
      name: 'Services monitoring',
      templates: []
    }
  ];

  res.json(categories);
});

module.exports = router;
