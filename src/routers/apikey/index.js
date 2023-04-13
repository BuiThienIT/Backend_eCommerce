'use strict'

const express = require('express')
const apiKeyController = require('../../controllers/apikey.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()

router.post('/create', asyncHandler(apiKeyController.createApiKey))

module.exports = router