
import express from 'express';
import azure from '../../modules/azure.js';

// var express = require('express');
// const azure = require('../../modules/azure');
var router = express.Router();

router.get('/login', azure.check.openId(), function(req, res, next) {
  res.redirect('/');
});
router.post('/return', azure.check.openId(), azure.get.openId.regenerateSessionAfterAuthentication, function(req, res, next) {
  
  res.redirect('/');
});
router.get('/logout', async function(req, res, next) {
  // let $store = req.app.get('$store');
  // $store.socket.removeLogoutUser($store, {
  //         userName: req.user.displayName, 
  //         oid: req.user.oid
  // });
  await azure.get.openId.sign.out(req, res, next);
  res.redirect('/');
});

// module.exports = router;
export default router;