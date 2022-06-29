var express = require('express');
var router = express.Router();
const azure = require('../modules/azure');

/* GET OAuth Login page. */
router.get('/login', function(req, res, next) {
    res.render('oauth/login', { title: 'OAuth Login Page' });
});
router.get('/', async (req, res, next) => {
    await azure.check.user(req, res);
    // res.render('home', profile.get.page(req, 'Home Page'));
    console.log(req.user);
    res.render('home', { title: 'Home Page' });
});

module.exports = router;
