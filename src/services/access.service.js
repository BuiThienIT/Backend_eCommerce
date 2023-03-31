'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { createTokenPair } = require('../auth/authUtils')
const KeyTokenService = require('./keyToken.service')
const { RoleShop } = require('../constants/shop.constant')
const { getInfoData } = require('../utils')
const {
    BadRequestError,
    ConflictRequestError,
} = require('../core/error.response')

class AccessService {
    static signUpRSA = async ({ name, email, password }) => {
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Shop is already registered')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP],
        })

        if (newShop) {
            // Created privateKy, publicKey
            const { privateKey, publicKey } = crypto.generateKeyPairSync(
                'rsa',
                {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    },
                },
            )
            // Public key CryptoGraphy Standards!

            const publicKeyString = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
            })

            if (!publicKeyString) {
                throw new BadRequestError('publicKeyString error')
            }

            const publicKeyObject = crypto.createPublicKey(publicKeyString)

            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKeyObject,
                privateKey,
            )

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop,
                    }),
                    tokens,
                },
            }
            return {
                code: 200,
                metadata: null,
            }
        }
    }

    static signUp = async ({ name, email, password }) => {
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Shop is already registered')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP],
        })

        if (newShop) {
            // Created privateKy, publicKey
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')
            // Public key CryptoGraphy Standards!
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            })

            if (!keyStore) {
                throw new BadRequestError('Error: keyStore error')
            }

            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                keyStore.publicKey,
                keyStore.privateKey,
            )

            return {
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop,
                    }),
                    tokens,
                },
            }
        }
        return {
            metadata: null,
        }
    }
}

module.exports = AccessService
