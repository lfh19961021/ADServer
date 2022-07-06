
import express from 'express';
import apiRouter from './api.js';
import viewsRouter from './views.js';

// var express = require('express');
// const apiRouter = require("./api");
// const viewsRouter = require("./views");
var router = express.Router();

router.use("/", viewsRouter);
router.use("/api", apiRouter);


// module.exports = router;

export default router;