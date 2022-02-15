const express = require('express')
const cors = require('cors')
const DBConnect = require('./mongo')
const Login = require('./routes/login')
const Google = require('./routes/google')
const Register = require('./routes/register')
const SaveData = require('./routes/saveData')
require('dotenv').config()

const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())

DBConnect().then(()=>console.log('DB Connection successfull!'))

app.get('/', (req,res)=>{ res.json('Server running')})
app.use('/api/gauth', Google)
app.use('/api/login', Login)
app.use('/api/register', Register)
app.use('/api/save', SaveData)

app.listen(port,()=>console.log(`Server listening on port ${port}`))