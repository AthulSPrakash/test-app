const app = require('express')()
const cors = require('cors')
const userModel = require('../components/models')
const verify = require('../components/tokenVerify')

app.post('/', cors(), verify, async (req,res)=>{

    const User = await userModel.findOne({email: req.body.email})
    const newData = {data: req.body.resumes}
    await User.update(newData)
    // const updatedDoc = await userModel.findOne({ email: req.body.email })
    // console.log(updatedDoc)
})

module.exports = app