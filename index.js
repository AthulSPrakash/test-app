const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Login = require('./routes/login')
const Google = require('./routes/google')
const Register = require('./routes/register')
const SaveData = require('./routes/saveData')
const dotenv = require('dotenv')

const app = express()

dotenv.config()

app.use(cors())

const port = process.env.PORT || 5000
const username = process.env.USER_NAME
const password = process.env.PASSWORD
const cluster = process.env.CLUSTER
const dbname = process.env.DB_NAME
const url = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err))

app.use(express.json())

app.use('/api/gauth', Google)
app.use('/api/login', Login)
app.use('/api/register', Register)
app.use('/api/save', SaveData)

app.listen(port,()=>console.log(`Server listening on port ${port}`))