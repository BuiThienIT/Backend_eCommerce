'use strict'
const mongoose = require('mongoose')
const { countConnect } = require('../helpers/check.connect')
const {
    db: { host, port, name },
} = require('../configs/config.mongodb')

const connectString = `mongodb://${host}:${port}/${name}`

class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose
            .connect(connectString, {
                maxPoolSize: 50,
            })
            .then(() => {
                console.log(
                    'Connected MongoDB Success! and number of connections::',
                    countConnect(),
                )
            })
            .catch(() => {
                console.log('Error connect!')
            })
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb
