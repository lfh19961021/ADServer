
import express from 'express';
import oauthRouter from './api/oauth.js';
// var express = require('express');
// const oauthRouter = require("./api/oauth");

var router = express.Router();

router.use("/oauth", oauthRouter);

// module.exports = router;

export default router;