import express from 'express';
import azure from '../modules/azure.js';
import socket from '../modules/socket.js';
// var express = require('express');
var router = express.Router();
// const azure = require('../modules/azure.js');

/* GET OAuth Login page. */
router.get('/login', function(req, res, next) {
    res.render('oauth/login', { title: 'OAuth Login Page' });
});
router.get('/', async (req, res, next) => {
    await azure.check.user(req, res);

    // Set cookies
    let oid = req.user.oid;
    let userName = req.user.displayName
    const expires = new Date(Date.now() + 1 * 3600000);
    res.cookie('oid', oid, { expires });

    res.render('home', { title: 'Home Page', userName, oid });
    // , messages: [{by: 'Me', content: 'Test1', by: 'Me', content: 'Test2',by: 'Me', content: 'Test3',}]
});

// module.exports = router;
export default router;
