require('dotenv').config()
const compression = require('compression')
const bodyParser = require('body-parser')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')

const app = express()
// init middlewares

app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())

// init db and check connection

require('./dbs/init.mongodb')
const { countConnect, checkOverload } = require('./helpers/check.connect')
checkOverload()

// init routes
app.use('/', require('./routers'))

// handdling errors

module.exports = app
