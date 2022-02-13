const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        max: 255,
        required: true
    },
    email: {
        type: String,
        unique: true,
        max: 255,
        required: true
    },
    password: {
        type: String,
        min: 8,
        required: true
    },
    image: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
    },
    data: []
})

const User = mongoose.model('User', userSchema)

module.exports = User