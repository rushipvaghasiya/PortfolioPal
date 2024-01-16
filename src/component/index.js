const express = require('express');
const usersRoute = require('./users/users.route');
const stocksRoute = require('./stocks/stocks.route');

const router = express.Router();

router.use('/users', usersRoute);
router.use('/stocks', stocksRoute);

module.exports = router;
