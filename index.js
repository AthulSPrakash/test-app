const express = require('express')
const cors = require('cors')
const DBConnect = require('./mongo')
const Login = require('./routes/login')
const Google = require('./routes/google')
const Register = require('./routes/register')
const SaveData = require('./routes/saveData')
const port = process.env.PORT || 5000

const dotenv = require('dotenv')
dotenv.config()

const app = express()

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())

DBConnect().then(async mongoose =>{
    try{
        console.log('DB Connection successfull!!');
    }finally{
        mongoose.connection.close()
    }
})

app.get('/', (req,res)=>{ res.json('Server running')})
app.use('/api/gauth', Google)
app.use('/api/login', Login)
app.use('/api/register', Register)
app.use('/api/save', SaveData)

app.listen(port,()=>console.log(`Server listening on port ${port}`))