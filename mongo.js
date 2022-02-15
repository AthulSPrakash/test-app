const mongoose = require('mongoose')
require('dotenv').config()

module.exports = async () => {

    const username = process.env.USER_NAME
    const password = process.env.PASSWORD
    // const cluster = process.env.CLUSTER
    const dbname = process.env.DB_NAME
    const url = `mongodb://${username}:${password}@cluster0-shard-00-00.pqq7v.mongodb.net:27017,cluster0-shard-00-01.pqq7v.mongodb.net:27017,cluster0-shard-00-02.pqq7v.mongodb.net:27017/${dbname}?ssl=true&replicaSet=atlas-qwfgu4-shard-0&authSource=admin&retryWrites=true&w=majority`
    const mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    await mongoose.connect(url, mongooseOptions)
    .then(x => console.log(`Connected to MongoDB!, ${x.connections[0].name}`))
    .catch(err => console.error('Error connecting to mongo', err))

    return mongoose
}