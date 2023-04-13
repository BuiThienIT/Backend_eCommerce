'use strict'
const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

router.use('/v1/api/apikey', require('./apikey'))

// Check apikey
router.use(apiKey)
router.use(permission('0000'))

router.use('/v1/api/product', require('./product'))
router.use('/v1/api', require('./access'))

module.exports = router
