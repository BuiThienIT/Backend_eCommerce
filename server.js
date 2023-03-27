const app = require('./src/app')
const PORT = 3050

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with port ${PORT}`)
})

process.on('SIGINT', () => {
    console.log('Exit Server Express')
})
