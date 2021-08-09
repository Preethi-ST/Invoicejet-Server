const express = require('express');
const router = express.Router();

const {roleAuth} = require('../middleware/roleAuth')
const dashboard = require('../controller/dashboard')
const isAuthorized = require('../middleware/isAuthorized')
router.post('/dashboard',isAuthorized,roleAuth(['admin','manager']),dashboard)

module.exports = router