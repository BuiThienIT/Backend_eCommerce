'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 3000000

// Count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    return numConnection
}

// Check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss

        const maxConnections = numCores * 5

        console.log(`Active connections:: ${numConnection}`)
        console.log(
            `Memory usage:: ${Math.floor(memoryUsage / 1024 / 1024)} MB`,
        )

        if (numConnection > maxConnections) {
            console.log('Connection overload detected')
        }
    }, _SECONDS) // Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload,
}
