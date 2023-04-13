'use strict'

const { SuccessResponse } = require('../core/success.response')
const apiKeyService = require('../services/apikey.service')

class ApiKeyController {
    // Create

    createApiKey = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create api key success',
            metadata: await apiKeyService.createApiKey(),
        }).send(res)
    }
}

module.exports = new ApiKeyController()
