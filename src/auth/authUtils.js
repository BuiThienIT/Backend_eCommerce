'use strict'

const JWT = require('jsonwebtoken')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const asyncHandler = require('../helpers/asyncHandler')
const { findByUserId } = require('../services/keyToken.service')
const { HEADER } = require('../constants')

const createTokenPair = async (payload, publicKey, privateKey) => {
    const accessToken = await JWT.sign(payload, publicKey, {
        expiresIn: '2 days',
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
        expiresIn: '7 days',
    })

    JWT.verify(accessToken, publicKey, (err, decode) => {
        if (err) {
            console.error(`error verify::`, err)
        } else {
            console.log(`decode verify::`, decode)
        }
    })

    return { accessToken, refreshToken }
}

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]

    if (!userId) throw new AuthFailureError('Invalid request')

    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found key store')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userid')

        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid request')

    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found key store')

    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userid')

            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userid')

        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

module.exports = {
    createTokenPair,
    authentication,
    authenticationV2,
    verifyJWT,
}
