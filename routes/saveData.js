const app = require('express')()
const userModel = require('../components/models')
const verify = require('../components/tokenVerify')

app.post('/', verify, async (req,res)=>{

    const User = await userModel.findOne({email: req.body.email})
    const newData = {data: req.body.resumes}
    await User.updateOne(newData)
    // const updatedDoc = await userModel.findOne({ email: req.body.email })
    // console.log(updatedDoc)
})

module.exports = app