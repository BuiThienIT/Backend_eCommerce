'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { createTokenPair } = require('../auth/authUtils')
const KeyTokenService = require('./keyToken.service')
const { RoleShop } = require('../constants/shop.constant')

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                return {
                    code: 'xxxx', // define in your document
                    message: 'Shop already registered!',
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP],
            })

            if (newShop) {
                // created privateKy, publicKey
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
                    return {
                        code: 'xxxx',
                        message: 'publicKeyString error',
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)

                const tokens = await createTokenPair(
                    { userId: newShop._id, email },
                    publicKeyString,
                    privateKey,
                )

                return {
                    code: 201,
                    metadata: {
                        shop: newShop,
                        tokens,
                    },
                }
            }
            return {
                code: 200,
                metadata: null,
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error',
            }
        }
    }
}

module.exports = AccessService
