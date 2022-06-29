var express = require('express');
var router = express.Router();
const oauthRouter = require("./api/oauth");

router.use("/oauth", oauthRouter);

module.exports = router;
