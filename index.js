const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Login = require('./routes/login')
// const Google = require('./routes/google')
const Register = require('./routes/register')
const SaveData = require('./routes/saveData')

const { googleAuth } = require('../components/validation')
const userModel = require('../components/models')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const app = express()

const dotenv = require('dotenv')
dotenv.config()

app.use(cors())

const port = process.env.PORT || 5000

const username = process.env.USER_NAME
const password = process.env.PASSWORD
// const cluster = process.env.CLUSTER
const dbname = process.env.DB_NAME

const url = `mongodb://${username}:${password}@cluster0-shard-00-00.pqq7v.mongodb.net:27017,cluster0-shard-00-01.pqq7v.mongodb.net:27017,cluster0-shard-00-02.pqq7v.mongodb.net:27017/${dbname}?ssl=true&replicaSet=atlas-qwfgu4-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err))

app.use(express.json())

app.post('/api/gauth', async (req,res)=>{

    const user = await googleAuth(req.body.token)
    const emailExist = await userModel.findOne({ email: user.email })

    const token = JWT.sign({_id: user.id}, process.env.TOKEN_KEY)
    
    const data = {
        token: token,
        email: user.email,
        name: user.name,
        image: user.image,
        data: emailExist && emailExist.data || []
    }

    if(!emailExist){
        const salt = await bcrypt.genSalt(10)
        const cipherPass = await bcrypt.hash(user.id, salt)

        const newUser = new userModel({
            username: user.name,
            email: user.email,
            password: cipherPass,
            image: user.image,
            data: []
        })

        try{
            await newUser.save()
            res.status(200).json(data)
        }catch (err){
            res.status(500).json(err)
        }
    }else{
        res.status(200).json(data)
    }
})

// app.use('/api/gauth', Google)
app.use('/api/login', Login)
app.use('/api/register', Register)
app.use('/api/save', SaveData)

app.listen(port,()=>console.log(`Server listening on port ${port}`))