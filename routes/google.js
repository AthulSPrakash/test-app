const app = require('express')()
const cors = require('cors')
const { googleAuth } = require('../components/validation')
const userModel = require('../components/models')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const dotenv = require('dotenv')
dotenv.config()

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))

app.post('/', async (req,res)=>{

    const user = await googleAuth(req.body.token)
    const emailExist = await userModel.findOne({ email: user.email })

    const token = JWT.sign({_id: user.id}, process.env.TOKEN_KEY)
    
    const data = {
        token: token,
        email: user.email,
        name: user.name,
        image: user.image,
        data: emailExist.data
    }

    if(!emailExist){
        const salt = await bcrypt.genSalt(10)
        const cipherPass = await bcrypt.hash(user.id, salt)

        const newUser = new userModel({
            username: user.name,
            email: user.email,
            password: cipherPass
        })

        try{
            await newUser.save()
            res.status(200).json(data)
        }catch (err){
            res.status(500).json(err)
        }
    }else{
        res.json(data)
    }
})

module.exports = app