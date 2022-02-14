const app = require('express')()
const cors = require('cors')

app.use(cors())

app.get('/', (req, res)=>{
    res.json('test route')
})

module.exports = app