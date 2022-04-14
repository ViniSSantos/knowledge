const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = app => {
    app.use(bodyParser.json()) //aplicando middleware que vai enterpretar o jason do body da requisição
    app.use(cors())
}