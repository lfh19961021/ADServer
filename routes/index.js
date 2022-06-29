var express = require('express');
var router = express.Router();
const apiRouter = require("./api");
const viewsRouter = require("./views");


router.use("/", viewsRouter);
router.use("/api", apiRouter);


module.exports = router;
