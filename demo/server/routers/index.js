const express = require('express');
const loginHandler = require('./login');

const router = express.Router({ 'caseSensitive': true, 'strict': true });

router.post('/login', loginHandler);

module.exports = router;