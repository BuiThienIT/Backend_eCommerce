'use strict'

const AccessService = require('../services/access.service')

const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class AccessController {
    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get token success',
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout success',
            metadata: await AccessService.logout(req),
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Regiserted OK',
            metadata: await AccessService.signUp(req.body),
        }).send(res)
    }
}

module.exports = new AccessController()
