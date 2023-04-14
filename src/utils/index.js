'use strict'

const _ = require('lodash')
const crypto = require('crypto')

const header = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rftoken-id',
}

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const createKeys = () => {
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    return { privateKey, publicKey }
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((value) => [value, 1]))
}

const unGetSelectData = (unSelect = []) => {
    return Object.fromEntries(unSelect.map((value) => [value, 0]))
}

const removeUndifinedObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === null || obj[key] === undefined) delete obj[key]
    })

    return obj
}

const nestedObjectParser = (obj) => {
    const final = {}
    Object.keys(obj).forEach((keyObj) => {
        if (typeof obj[keyObj] === 'object' && !Array.isArray(obj[keyObj])) {
            const response = nestedObjectParser(obj[keyObj])
            Object.keys(response).forEach((keyResponse) => {
                final[`${keyObj}.${keyResponse}`] = response[keyResponse]
            })
        } else {
            final[keyObj] = obj[keyObj]
        }
    })
    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    createKeys,
    unGetSelectData,
    header,
    removeUndifinedObject,
    nestedObjectParser,
}
