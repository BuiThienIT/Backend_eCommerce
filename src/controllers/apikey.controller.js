'use strict'

const { SuccessResponse, CREATED } = require('../core/success.response')
const apiKeyService = require('../services/apikey.service')

class ApiKeyController {
    // Create

    createApiKey = async (req, res, next) => {
        new CREATED({
            message: 'Create api key success',
            metadata: await apiKeyService.createApiKey(),
        }).send(res)
    }
}

module.exports = new ApiKeyController()
