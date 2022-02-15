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

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))

const port = process.env.PORT || 5000
const username = process.env.USER_NAME
const password = process.env.PASSWORD
// const cluster = process.env.CLUSTER
const dbname = process.env.DB_NAME
const url = `mongodb://${username}:${password}@cluster0-shard-00-00.pqq7v.mongodb.net:27017,cluster0-shard-00-01.pqq7v.mongodb.net:27017,cluster0-shard-00-02.pqq7v.mongodb.net:27017/${dbname}?ssl=true&replicaSet=atlas-qwfgu4-shard-0&authSource=admin&retryWrites=true&w=majority`
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connectDB = async () => {
    try{
        await mongoose.connect(url, mongooseOptions)
        console.log('Connected to MongoDB')
    }catch (err) {
        console.log('Error: ' + err)
    }
}
connectDB()

app.use(express.json())

app.get('/', (req,res)=>{ res.json('Server running')})
app.use('/api/gauth', Google)
app.use('/api/login', Login)
app.use('/api/register', Register)
app.use('/api/save', SaveData)

app.listen(port,()=>console.log(`Server listening on port ${port}`))