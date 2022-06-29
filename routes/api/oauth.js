var express = require('express');
var router = express.Router();
const azure = require('../../modules/azure');

router.get('/login', azure.check.openId(), function(req, res, next) {
  console.log('me in login');
  res.redirect('/');
});
router.post('/return', azure.check.openId(), azure.get.openId.regenerateSessionAfterAuthentication, function(req, res, next) {
  res.send('return');
});
router.get('/logout', function(req, res, next) {
  res.send('logout');
});

module.exports = router;
