const app = require('express')()
const { googleAuth } = require('../components/validation')
const userModel = require('../components/models')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const dotenv = require('dotenv')
dotenv.config()

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next()
})

app.post('/', async (req,res)=>{

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

module.exports = app