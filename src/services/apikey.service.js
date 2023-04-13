'use strict'

const apiKeyModel = require('../models/apikey.model')
const crypto = require('crypto')

const findById = async (key) => {
    // Create Key

    // const apiKey = crypto.randomBytes(64).toString('hex')
    // const newKey = await apiKeyModel.create({
    //     key: apiKey,
    //     permissions: ['0000'],
    // })

    const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
    return objKey
}

const createApiKey = async () => {
    const apiKey = crypto.randomBytes(64).toString('hex')
    const newKey = await apiKeyModel.create({
        key: apiKey,
        permissions: ['0000'],
    })

    return newKey
}

module.exports = {
    findById,
    createApiKey,
}
